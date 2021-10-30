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
import { Button, Text, Tile, Image } from "react-native-elements"
import { useStores } from "../../models"

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
}

export const RecommendationsScreen: FC<
  StackScreenProps<NavigatorParamList, "recommendations">
> = observer(({ navigation }) => {
  const { recipeStore } = useStores()
  const { recipes } = recipeStore

  useEffect(() => {
    async function fetchData() {
      await recipeStore.getRecipes()
    }

    fetchData()
  }, [recipes])

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
                    caption={recipe.description}
                  />
                </>
              )}
            </View>
          )}
        />
      </WideView>
    </Screen>
  )
})
