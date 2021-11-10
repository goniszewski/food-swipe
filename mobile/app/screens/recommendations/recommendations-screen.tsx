import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import styled, { css } from "@emotion/native"
import CardsSwipe from "react-native-cards-swipe"
import { Screen } from "../../components"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Button, Text, Tile, Badge, Icon } from "react-native-elements"
import { Recipe, useStores } from "../../models"

const WideView = styled.View`
  align-items: center;
  justify-content: center;
  width: 80%;
  flex: 1;
`

const styles = {
  root: css`
    background-color: ${color.palette.white};
    align-items: center;
    flex: 1;
  `,
  recipeContainer: css`
    /* width: 92%;
    height: 70%; */
    border-radius: 20px;
  `,
  recipeTileTitleContainer: css`
    background: rgba(40, 40, 40, 0.8);
    font-weight: 600;
    font-size: 26px;
    text-transform: uppercase;
  `,
  recipeTileCaptionContainer: css`
    background: rgba(40, 40, 40, 0.8);
    font-style: italic;
    font-size: 18px;
  `,
  reject: css`
    margin-top: 40%;
  `,
  accept: css`
    margin-top: 40%;
  `,
}

export const RecommendationsScreen: FC<
  StackScreenProps<NavigatorParamList, "recommendations">
> = observer(({ navigation }) => {
  const { recipeStore, userStore } = useStores()
  const { recipes }: { recipes: Recipe[] } = recipeStore

  useEffect(() => {
    async function fetchData() {
      await recipeStore.getRecipes()
    }

    fetchData()
  }, [recipes])

  const onApprove = async (index: number) => {
    const { id } = recipes[index]
    console.info(`Approving recipe with id ${id}`)

    return userStore.approveRecipe(id)
  }

  const onReject = async (index: number) => {
    const { id } = recipes[index]
    console.info(`Rejecting recipe with id ${id}`)

    return userStore.rejectRecipe(id)
  }

  return (
    <Screen style={styles.root} preset="fixed">
      <WideView>
        <Text h1>Some Recipes</Text>
        <Text>Found {recipes.length} recipes</Text>
        <CardsSwipe
          cards={[...recipes]}
          cardContainerStyle={styles.recipeContainer}
          renderCard={(recipe) => (
            <View style={styles.root}>
              {recipe && (
                <>
                  <Text>Dada</Text>
                  <Tile
                    imageSrc={{ uri: recipe.image }}
                    // imageProps={{ resizeMode: "cover" }}
                    // contentContainerStyle={{ height: 70, backgroundColor: "#ccc" }}
                    title={recipe.name}
                    featured
                    caption={`${recipe.description} ${
                      recipe.preparationTime > 0
                        ? `\nPreparation time: ${recipe.preparationTime}`
                        : ""
                    }`}
                    captionStyle={styles.recipeTileCaptionContainer}
                    titleStyle={styles.recipeTileTitleContainer}
                  />
                </>
              )}
            </View>
          )}
          renderNope={() => (
            <Icon
              name="meh-rolling-eyes"
              type="font-awesome-5"
              size={64}
              color="red"
              containerStyle={{ ...styles.reject, transform: [{ rotate: "25deg" }] }}
            />
          )}
          renderYep={() => (
            <Icon
              name="laugh-beam"
              type="font-awesome-5"
              size={64}
              color="green"
              containerStyle={{ ...styles.accept, transform: [{ rotate: "-25deg" }] }}
            />
          )}
          onSwipedLeft={(index) => onReject(index)}
          onSwipedRight={(index) => onApprove(index)}
        />
      </WideView>
    </Screen>
  )
})
