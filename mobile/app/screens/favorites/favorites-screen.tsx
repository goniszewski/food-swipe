import React, { createRef, FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, ImageBackground } from "react-native"
import styled, { css } from "@emotion/native"
import CardsSwipe from "react-native-cards-swipe"
import { Screen } from "../../components"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import {
  Image,
  Text,
  Tile,
  Badge,
  Icon,
  Header,
  ListItem,
  Avatar,
  Button,
} from "react-native-elements"
import { Recipe, User, useStores } from "../../models"
import { Favorite } from "../../models/favorite/favorite"

const WideView = styled.View`
  align-items: center;
  width: 100%;
  flex: 1;
  /* justify-content: center; */
`

const styles = {
  root: css`
    background-color: ${color.palette.white};
    /* align-items: center; */
    /* flex: 1; */
  `,
  header: css`
    margin-bottom: 5%;
  `,
  messageContainer: css`
    align-items: center;
    justify-content: center;
    flex: 1;
    margin: 0 auto;
  `,
  favoritedListContainer: css`
    align-items: flex-start;
    min-width: 100%;
  `,
  favoritedListItem: css`
    min-width: 100%;
  `,
  favoriteContent: css``,
  favoriteTitle: css`
    min-width: 100%;
    font-size: 14px;
    color: ${color.palette.black};
  `,
  footer: css`
    flex-direction: row;
    justify-content: space-between;
    min-width: 70%;
    margin: 5% 15%;
  `,
}

export const FavoritesScreen: FC<StackScreenProps<NavigatorParamList, "favorites">> = observer(
  ({ navigation }) => {
    const { favoriteStore, userStore } = useStores()
    // const { recipes }: { recipes: Recipe[] } = recipeStore
    const { favorites }: { favorites: Favorite[] } = favoriteStore

    useEffect(() => {
      ;(async () => {
        await favoriteStore.getFavorites()
      })()
    }, [favorites])

    const onRemove = async (id: string) => {
      console.info(`Removing recipe with id ${id} from favorites`)

      return userStore.removeFavoriteRecipe(id) || false
    }

    // const onReject = async (index: number) => {
    //   const { id } = recommendations[index]
    //   console.info(`Rejecting recipe with id ${id}`)

    //   return userStore.rejectRecipe(id)
    // }

    return (
      <Screen style={styles.root} preset="fixed" statusBar={"dark-content"}>
        <Header
          backgroundColor={color.palette.white}
          centerComponent={{
            text: "Favorites",
            style: { color: color.palette.black, fontSize: 20 },
          }}
          leftComponent={{
            icon: "utensils",
            type: "font-awesome-5",
            color: color.palette.black,
            onPress: () => navigation.navigate("recommendations"),
          }}
          // rightComponent={{
          //   icon: "favorite",
          //   color: color.palette.black,
          //   onPress: () => navigation.navigate("favorites"),
          // }}
        />
        <WideView style={styles.favoritedListContainer}>
          {favorites.length > 0 ? (
            favorites.map((favorite, i) => (
              <>
                <ListItem.Swipeable
                  key={favorite.id}
                  style={styles.favoritedListItem}
                  bottomDivider
                  rightContent={
                    <Button
                      title="Delete"
                      icon={{ name: "delete", color: "white" }}
                      buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                      onPress={() => onRemove(favorite.id)}
                    />
                  }
                >
                  <Avatar source={{ uri: favorite.image }} />
                  <ListItem.Content style={styles.favoriteContent}>
                    <ListItem.Title style={styles.favoriteTitle}>{favorite.name}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem.Swipeable>
              </>
            ))
          ) : (
            <View style={styles.messageContainer}>
              <Text>Favorite some recipes first!</Text>
            </View>
          )}
        </WideView>
        <View style={styles.footer}></View>
      </Screen>
    )
  },
)
