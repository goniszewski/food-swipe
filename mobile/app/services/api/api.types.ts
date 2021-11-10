import { GeneralApiProblem } from "./api-problem"
import { Character } from "../../models/character/character"
import { Recipe, User } from "../../models"

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem

export type GetCharactersResult = { kind: "ok"; characters: Character[] } | GeneralApiProblem
export type GetCharacterResult = { kind: "ok"; character: Character } | GeneralApiProblem

export type GetRecipesResult = { kind: "ok"; recipes: Recipe[] } | GeneralApiProblem
export type GetRecipeResult = { kind: "ok"; recipe: Recipe } | GeneralApiProblem
