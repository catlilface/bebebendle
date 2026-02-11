"""Bebebendle Telegram Bot - Python implementation using aiogram."""

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import Any

from aiogram import Bot, Dispatcher, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import KeyboardButton, Message, ReplyKeyboardMarkup, ReplyKeyboardRemove
from dotenv import load_dotenv

from database import Database

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Bot configuration
BOT_TOKEN = os.getenv("BOT_TOKEN")
if not BOT_TOKEN:
    raise ValueError("BOT_TOKEN environment variable is not set")

# Initialize bot and dispatcher
bot = Bot(token=BOT_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)
router = Router()

# Initialize database
db = Database("./db/bebendle.sqlite")


class SuggestStates(StatesGroup):
    """States for the suggest scran wizard."""

    photo = State()
    name = State()
    description = State()
    price = State()
    confirmation = State()


@asynccontextmanager
async def database_session():
    """Async context manager for database sessions."""
    await db.connect()
    try:
        yield db
    finally:
        await db.close()


@router.message(Command("start"))
async def cmd_start(message: Message) -> None:
    """Handle /start command."""
    welcome_text = (
        "👋 Привет! Я овсянка, бот бебебендла.\n\n"
        "Я помогу тебе предложить новое блюдо для дейлика.\n\n"
        "📋 Доступные команды:\n"
        "/suggest - Предложить новое блюдо\n"
        "/help - Показать помощь\n\n"
    )
    await message.answer(welcome_text)


@router.message(Command("help"))
async def cmd_help(message: Message) -> None:
    """Handle /help command."""
    help_text = (
        "🤖 Помощь по боту бебебендла\n\n"
        "Как предложить блюдо:\n"
        "1. Используй команду /suggest\n"
        "2. Отправь фото блюда\n"
        "3. Напиши название (2-100 символов)\n"
        "4. Добавь описание (или пропусти)\n"
        "5. Укажи примерную себестоимость в рублях\n"
        "6. Подтверди предложение\n\n"
        "Ограничения:\n"
        "• Можно предлагать блюда круглосуточно\n"
        "• Администратор проверяет предложения перед публикацией\n"
        "• Не допускаются неприемлемые изображения\n\n"
        "Команды:\n"
        "/suggest - Предложить блюдо\n"
        "/help - Эта помощь"
    )
    await message.answer(help_text)


@router.message(Command("suggest"))
async def cmd_suggest(message: Message, state: FSMContext) -> None:
    """Handle /suggest command - start the wizard."""
    if not message.from_user:
        await message.answer("Ошибка: не удалось получить информацию о пользователе.")
        return

    # Clear any existing state
    await state.clear()

    # Store user info
    await state.update_data(
        telegram_id=str(message.from_user.id),
        telegram_username=message.from_user.username,
    )

    cancel_keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="❌ Отменить")]],
        resize_keyboard=True,
        one_time_keyboard=True,
    )

    await message.answer(
        "📸 Отлично! Давай добавим новое блюдо.\n\nШаг 1/4: Отправь фото блюда (только одно фото)",
        reply_markup=cancel_keyboard,
    )
    await state.set_state(SuggestStates.photo)


@router.message(SuggestStates.photo)
async def process_photo(message: Message, state: FSMContext) -> None:
    """Process photo step."""
    if message.text == "❌ Отменить":
        await cancel_suggestion(message, state)
        return

    if not message.photo:
        await message.answer("Пожалуйста, отправь фото блюда (только одно фото).")
        return

    # Get the largest photo
    photo = message.photo[-1]
    file_id = photo.file_id

    # Get file info from Telegram
    try:
        file = await bot.get_file(file_id)
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file.file_path}"

        await state.update_data(photo_url=file_url)

        cancel_keyboard = ReplyKeyboardMarkup(
            keyboard=[[KeyboardButton(text="❌ Отменить")]],
            resize_keyboard=True,
        )

        await message.answer(
            "✅ Фото получено!\n\nШаг 2/4: Отправь название блюда (2-100 символов)",
            reply_markup=cancel_keyboard,
        )
        await state.set_state(SuggestStates.name)
    except Exception as e:
        logger.error(f"Error getting photo: {e}")
        await message.answer("Ошибка при получении фото. Попробуй другое фото.")


@router.message(SuggestStates.name)
async def process_name(message: Message, state: FSMContext) -> None:
    """Process name step."""
    if not message.text:
        await message.answer("Пожалуйста, отправь текстовое сообщение.")
        return

    if message.text == "❌ Отменить":
        await cancel_suggestion(message, state)
        return

    name = message.text.strip()

    if len(name) < 2 or len(name) > 100:
        await message.answer("Название должно быть от 2 до 100 символов. Попробуй ещё раз.")
        return

    await state.update_data(name=name)

    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="-"), KeyboardButton(text="❌ Отменить")]],
        resize_keyboard=True,
    )

    await message.answer(
        f'✅ Название: "{name}"\n\n'
        'Шаг 3/4: Отправь описание блюда (или напиши "-" чтобы пропустить)',
        reply_markup=keyboard,
    )
    await state.set_state(SuggestStates.description)


@router.message(SuggestStates.description)
async def process_description(message: Message, state: FSMContext) -> None:
    """Process description step."""
    if not message.text:
        await message.answer("Пожалуйста, отправь текстовое сообщение.")
        return

    if message.text == "❌ Отменить":
        await cancel_suggestion(message, state)
        return

    description = None if message.text == "-" else message.text.strip()

    if description and len(description) > 500:
        await message.answer("Описание слишком длинное (максимум 500 символов). Попробуй покороче.")
        return

    await state.update_data(description=description)

    cancel_keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="❌ Отменить")]],
        resize_keyboard=True,
    )

    status = "✅ Описание получено" if description else "✅ Без описания"
    await message.answer(
        f"{status}\n\nШаг 4/4: Отправь примерную себестоимость в рублях (только число, например: 299.99)",
        reply_markup=cancel_keyboard,
    )
    await state.set_state(SuggestStates.price)


@router.message(SuggestStates.price)
async def process_price(message: Message, state: FSMContext) -> None:
    """Process price step."""
    if not message.text:
        await message.answer("Пожалуйста, отправь текстовое сообщение с ценой.")
        return

    if message.text == "❌ Отменить":
        await cancel_suggestion(message, state)
        return

    try:
        price_text = message.text.replace(",", ".")
        price = float(price_text)

        if price < 0 or price > 1000000:
            await message.answer("Некорректная цена. Введи число от 0 до 1000000.")
            return

        await state.update_data(price=price)

        # Get all data for preview
        data = await state.get_data()

        preview = (
            "📋 Проверь данные:\n\n"
            f"🖼 Фото: {'✅' if data.get('photo_url') else '❌'}\n"
            f"📝 Название: {data['name']}\n"
            f"📄 Описание: {data.get('description') or '(нет)'}\n"
            f"💰 Цена: {price:.2f} ₽\n\n"
            "Всё верно?"
        )

        confirm_keyboard = ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="✅ Да, отправить")],
                [KeyboardButton(text="❌ Нет, отменить")],
            ],
            resize_keyboard=True,
            one_time_keyboard=True,
        )

        await message.answer(preview, reply_markup=confirm_keyboard)
        await state.set_state(SuggestStates.confirmation)

    except ValueError:
        await message.answer("Пожалуйста, отправь цену числом.")


@router.message(SuggestStates.confirmation)
async def process_confirmation(message: Message, state: FSMContext) -> None:
    """Process confirmation step."""
    if message.text == "✅ Да, отправить":
        data = await state.get_data()

        try:
            async with database_session() as database:
                await database.insert_scran(
                    image_url=data["photo_url"],
                    name=data["name"],
                    description=data.get("description"),
                    price=data["price"],
                )

            await message.answer(
                "🎉 Отлично!\n\n"
                "Твоё предложение отправлено на рассмотрение администратору.\n\n"
                "Используй /status чтобы проверить статус.",
                reply_markup=ReplyKeyboardRemove(),
            )
            logger.info(f"New scran suggested by user {data['telegram_id']}: {data['name']}")

        except Exception as e:
            logger.error(f"Error saving scran: {e}")
            await message.answer(
                "❌ Произошла ошибка при сохранении. Попробуй позже.",
                reply_markup=ReplyKeyboardRemove(),
            )
    else:
        await message.answer(
            "❌ Предложение отменено. Используй /suggest чтобы начать заново.",
            reply_markup=ReplyKeyboardRemove(),
        )

    await state.clear()


async def cancel_suggestion(message: Message, state: FSMContext) -> None:
    """Cancel the suggestion wizard."""
    await state.clear()
    await message.answer(
        "❌ Предложение отменено. Используй /suggest чтобы начать заново.",
        reply_markup=ReplyKeyboardRemove(),
    )


@router.message(Command("status"))
async def cmd_status(message: Message) -> None:
    """Handle /status command."""
    if not message.from_user:
        await message.answer("Ошибка: не удалось получить информацию о пользователе.")
        return

    telegram_id = str(message.from_user.id)

    try:
        async with database_session() as database:
            user_scrans = await database.get_user_scrans(telegram_id)

        if not user_scrans:
            await message.answer(
                "У тебя пока нет предложений. Используй /suggest чтобы добавить блюдо!"
            )
            return

        response = "📊 Твои предложения:\n\n"
        for i, scran in enumerate(user_scrans, 1):
            status = "✅ Одобрено" if scran["approved"] else "⏳ На рассмотрении"
            response += f"{i}. {scran['name']} - {status}\n"

        await message.answer(response)

    except Exception as e:
        logger.error(f"Error fetching status: {e}")
        await message.answer("Произошла ошибка при получении статуса. Попробуй позже.")


@router.message(F.text)
async def handle_unknown(message: Message) -> None:
    """Handle unknown messages."""
    await message.answer(
        "Я не понимаю это сообщение. Используй /suggest чтобы предложить блюдо или /help для помощи."
    )


async def main() -> None:
    """Main entry point."""
    # Include router
    dp.include_router(router)

    # Start bot
    logger.info("Starting bot...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
