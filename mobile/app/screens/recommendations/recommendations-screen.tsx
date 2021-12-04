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
import { Image, Text, Tile, Badge, Icon, Header } from "react-native-elements"
import { Recipe, User, useStores } from "../../models"
import { Recommendation } from "../../models/recommendation/recommendation"

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
  cardContainer: css`
    flex: 1;
    width: 95%;
    border-radius: 15px;
  `,
  card: css`
    flex: 1;
    min-width: 100%;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    border: 1px solid ${color.palette.lightGrey};
  `,
  cardImage: css`
    border-radius: 15px;
  `,
  cardTitle: css`
    background: rgba(40, 40, 40, 0.8);
    color: ${color.palette.white};
    font-weight: 600;
    font-size: 26px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 10%;
  `,

  cardCaption: css`
    color: ${color.palette.white};
    background: rgba(40, 40, 40, 0.8);
    font-style: italic;
    font-size: 18px;
    padding: 5px;
  `,
  cardPreparation: css`
    margin-top: 10%;
    padding: 5px;
    color: ${color.palette.white};
    background: rgba(40, 40, 40, 0.8);
    font-size: 18px;
  `,
  reject: css`
    margin-top: 20%;
    margin-left: 10%;
  `,
  accept: css`
    margin-top: 20%;
    margin-left: 10%;
  `,
  footer: css`
    flex-direction: row;
    justify-content: space-between;
    min-width: 70%;
    margin: 5% 15%;
  `,
  rejectFooter: css`
    font-size: 22px;
    color: red;
  `,
  acceptFooter: css`
    font-size: 22px;
    color: green;
  `,
}

export const RecommendationsScreen: FC<
  StackScreenProps<NavigatorParamList, "recommendations">
> = observer(({ navigation }) => {
  const { recommendationStore, userStore } = useStores()
  // const { recipes }: { recipes: Recipe[] } = recipeStore
  const { recommendations }: { recommendations: Recommendation[] } = recommendationStore

  const swiperRef = createRef()

  useEffect(() => {
    console.log("Recommendations count: ", recommendations.length)
    if (recommendations.length === 0) {
      ;(async () => {
        await recommendationStore.getRecommendations()
      })()
    }
  }, [recommendations])

  const onApprove = async (index: number) => {
    const { id } = recommendations[index]
    console.info(`Approving recipe with id ${id}`)

    return userStore.approveRecipe(id)
  }

  const onReject = async (index: number) => {
    const { id } = recommendations[index]
    console.info(`Rejecting recipe with id ${id}`)

    return userStore.rejectRecipe(id)
  }

  return (
    <Screen style={styles.root} preset="fixed">
      <Header
        backgroundColor={color.palette.white}
        centerComponent={{
          text: "Recommendations",
          style: { color: color.palette.black, fontSize: 20 },
        }}
        rightComponent={{
          icon: "favorite",
          color: color.palette.black,
          onPress: () => navigation.navigate("home"),
        }}
      />
      <WideView>
        {/* <View style={styles.header}>
          <Text h1>Recommendations</Text>
        </View> */}
        <CardsSwipe
          cards={[...recommendations]}
          cardContainerStyle={styles.cardContainer}
          ref={swiperRef}
          renderCard={(recipe) =>
            recipe ? (
              <ImageBackground
                source={{ uri: recipe.image }}
                style={styles.card}
                imageStyle={styles.cardImage}
                resizeMode="cover"
              >
                <Text style={styles.cardTitle}>{recipe.name}</Text>
                <Text style={styles.cardCaption}>{recipe.description}</Text>
                {recipe.preparationTime ? (
                  <Text
                    style={styles.cardPreparation}
                  >{`Preparation time: ${recipe.preparationTime}`}</Text>
                ) : null}
              </ImageBackground>
            ) : (
              <View>
                <Text>Loading...</Text>
              </View>
            )
          }
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
      <View style={styles.footer}>
        <Text
          style={{ ...styles.rejectFooter }}
          onPress={() => {
            swiperRef.current.swipeLeft()
          }}
        >
          meh...
        </Text>
        <Text
          style={{ ...styles.acceptFooter }}
          onPress={() => {
            swiperRef.current.swipeRight()
          }}
        >
          yummy!
        </Text>
      </View>
    </Screen>
  )
})
