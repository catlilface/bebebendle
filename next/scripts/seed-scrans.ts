import { db, scrans } from "../db/schema";

const placeholderScrans = [
  { name: "Пицца Маргарита", description: "Классическая итальянская пицца с томатами и моцареллой", price: 450, imageUrl: "/placeholder-pizza.jpg" },
  { name: "Бургер Чизбургер", description: "Сочная говяжья котлета с сыром чеддер", price: 350, imageUrl: "/placeholder-burger.jpg" },
  { name: "Суши Филадельфия", description: "Роллы с лососем, сливочным сыром и огурцом", price: 520, imageUrl: "/placeholder-sushi.jpg" },
  { name: "Шаурма Классическая", description: "Куриная шаурма с овощами и соусом", price: 280, imageUrl: "/placeholder-shawarma.jpg" },
  { name: "Паста Карбонара", description: "Спагетти с беконом, яйцом и сыром пармезан", price: 480, imageUrl: "/placeholder-pasta.jpg" },
  { name: "Тако с говядиной", description: "Мексиканские тако с говядиной и сальсой", price: 320, imageUrl: "/placeholder-taco.jpg" },
  { name: "Рамен с курицей", description: "Японский суп-лапша с курицей и яйцом", price: 420, imageUrl: "/placeholder-ramen.jpg" },
  { name: "Салат Цезарь", description: "Классический салат с курицей, сухариками и соусом", price: 380, imageUrl: "/placeholder-caesar.jpg" },
  { name: "Хот-дог Нью-Йорк", description: "Фирменный хот-дог с горчицей и квашеной капустой", price: 250, imageUrl: "/placeholder-hotdog.jpg" },
  { name: "Пельмени Домашние", description: "Сочные пельмени со сметаной", price: 340, imageUrl: "/placeholder-dumplings.jpg" },
  { name: "Блины с икрой", description: "Тонкие блины с красной икрой и сливочным маслом", price: 650, imageUrl: "/placeholder-pancakes.jpg" },
  { name: "Оливье Салат", description: "Традиционный новогодний салат с колбасой", price: 220, imageUrl: "/placeholder-olivier.jpg" },
  { name: "Стейк Рибай", description: "Сочный говяжий стейк средней прожарки", price: 1200, imageUrl: "/placeholder-steak.jpg" },
  { name: "Борщ Украинский", description: "Наваристый борщ с сметаной и пампушками", price: 290, imageUrl: "/placeholder-borscht.jpg" },
  { name: "Чизкейк Нью-Йорк", description: "Нежный чизкейк с ягодным соусом", price: 380, imageUrl: "/placeholder-cheesecake.jpg" },
  { name: "Тирамису", description: "Итальянский десерт с маскарпоне и кофе", price: 420, imageUrl: "/placeholder-tiramisu.jpg" },
  { name: "Картошка Фри", description: "Хрустящий картофель фри с кетчупом", price: 180, imageUrl: "/placeholder-fries.jpg" },
  { name: "Куриные Крылышки", description: "Острые крылышки барбекю", price: 390, imageUrl: "/placeholder-wings.jpg" },
  { name: "Лазанья Болоньезе", description: "Слоёная запеканка с мясным соусом", price: 460, imageUrl: "/placeholder-lasagna.jpg" },
  { name: "Плов Узбекский", description: "Ароматный плов с бараниной и морковью", price: 410, imageUrl: "/placeholder-pilaf.jpg" },
];

async function seedScrans() {
  console.log("Seeding 20 approved scrans...");
  
  for (const scran of placeholderScrans) {
    await db.insert(scrans).values({
      ...scran,
      approved: true,
      numberOfLikes: Math.floor(Math.random() * 100) + 20,
      numberOfDislikes: Math.floor(Math.random() * 30),
    });
  }
  
  console.log("✅ Successfully added 20 approved scrans!");
  process.exit(0);
}

seedScrans().catch((error) => {
  console.error("Error seeding scrans:", error);
  process.exit(1);
});
