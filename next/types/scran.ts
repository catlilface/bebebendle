/**
 * Scran type for client-side use (without database imports)
 */

export interface Scran {
  id: number;
  imageUrl: string;
  name: string;
  description: string | null;
  price: number;
  numberOfLikes: number;
  numberOfDislikes: number;
  approved?: boolean;
}
