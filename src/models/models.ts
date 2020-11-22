export enum Toppings {
	Meat = "Meat",
	Bacon = "Bacon",
	Onions = "Onions",
	Cheese = "Cheese",
	Pineapple = "Pineapple",
	Ham = "Ham",
	Mushrooms = "Mushrooms",
}

export type Pizza = Toppings[];

export interface PostOrderRequest {
	pizza: Pizza;
}
