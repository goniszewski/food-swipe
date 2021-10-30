import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import styled, { css } from "@emotion/native"
import { Screen } from "../../components"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Input } from "react-native-elements/dist/input/Input"
import { Button, Text } from "react-native-elements"

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
}

export const LoginScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={styles.root} preset="fixed">
        <WideView>
          <Text h1>FoodSwipe</Text>
        </WideView>
        <WideView>
          <Input placeholder="Login" />
          <Input placeholder="Password" secureTextEntry />
        </WideView>
        <WideView>
          <Button title="Sign in" onPress={() => navigation.navigate("recommendations")} />
        </WideView>
      </Screen>
    )
  },
)
