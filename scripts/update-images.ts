import { db, scrans } from "../db/schema";
import { eq } from "drizzle-orm";

const placeholderImages: Record<string, string> = {
  "Пицца Маргарита": "https://placehold.co/600x400/ff6b6b/ffffff?text=🍕+Pizza",
  "Бургер Чизбургер": "https://placehold.co/600x400/f4a261/ffffff?text=🍔+Burger",
  "Суши Филадельфия": "https://placehold.co/600x400/2a9d8f/ffffff?text=🍣+Sushi",
  "Шаурма Классическая": "https://placehold.co/600x400/e9c46a/ffffff?text=🌯+Shawarma",
  "Паста Карбонара": "https://placehold.co/600x400/e76f51/ffffff?text=🍝+Pasta",
  "Тако с говядиной": "https://placehold.co/600x400/264653/ffffff?text=🌮+Taco",
  "Рамен с курицей": "https://placehold.co/600x400/f4a261/ffffff?text=🍜+Ramen",
  "Салат Цезарь": "https://placehold.co/600x400/606c38/ffffff?text=🥗+Caesar",
  "Хот-дог Нью-Йорк": "https://placehold.co/600x400/d62828/ffffff?text=🌭+Hotdog",
  "Пельмени Домашние": "https://placehold.co/600x400/8d99ae/ffffff?text=🥟+Dumplings",
  "Блины с икрой": "https://placehold.co/600x400/f4d35e/ffffff?text=🥞+Pancakes",
  "Оливье Салат": "https://placehold.co/600x400/90a955/ffffff?text=🥗+Olivier",
  "Стейк Рибай": "https://placehold.co/600x400/6f1d1b/ffffff?text=🥩+Steak",
  "Борщ Украинский": "https://placehold.co/600x400/a4161a/ffffff?text=🍲+Borscht",
  "Чизкейк Нью-Йорк": "https://placehold.co/600x400/ffb703/ffffff?text=🍰+Cheesecake",
  "Тирамису": "https://placehold.co/600x400/8b5e3c/ffffff?text=🍮+Tiramisu",
  "Картошка Фри": "https://placehold.co/600x400/fca311/ffffff?text=🍟+Fries",
  "Куриные Крылышки": "https://placehold.co/600x400/d00000/ffffff?text=🍗+Wings",
  "Лазанья Болоньезе": "https://placehold.co/600x400/e85d04/ffffff?text=🍝+Lasagna",
  "Плов Узбекский": "https://placehold.co/600x400/ff9f1c/ffffff?text=🍚+Pilaf",
};

async function updatePlaceholderImages() {
  console.log("Updating placeholder images...");
  
  for (const [name, imageUrl] of Object.entries(placeholderImages)) {
    const result = await db
      .update(scrans)
      .set({ imageUrl })
      .where(eq(scrans.name, name));
    
    console.log(`Updated ${name}: ${imageUrl}`);
  }
  
  console.log("✅ Successfully updated all placeholder images!");
  process.exit(0);
}

updatePlaceholderImages().catch((error) => {
  console.error("Error updating images:", error);
  process.exit(1);
});
