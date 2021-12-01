import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import styled, { css } from "@emotion/native"
import { Screen } from "../../components"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Button, Text, Input } from "react-native-elements"
import { useStores } from "../../models"
import { Tokens } from "../../services/api"

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
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      login: "",
      password: "",
    })
    const [error, setError] = useState(null)

    const { authStore } = useStores()
    // const { tokens }: { tokens: Tokens } = authStore

    const handleLogin = async () => {
      setLoading(true)
      const response = await authStore.login(formData)

      setTimeout(() => {
        setLoading(false)

        if (response === "rejected") {
          setError("Wrong credentials.")
        }
      }, 2000)

      if (response === "ok") {
        setLoading(false)
        return navigation.navigate("recommendations")
      }
    }

    const onInputChange = (field: string, value: string) => {
      setFormData((prevState) => {
        return {
          ...prevState,
          [field]: value,
        }
      })
    }

    return (
      <Screen style={styles.root} preset="fixed">
        <WideView>
          <Text h1>FoodSwipe</Text>
        </WideView>
        <WideView>
          <Input
            placeholder="Login"
            value={formData.login}
            onChangeText={(v) => onInputChange("login", v)}
            autoCapitalize="none"
          />
          <Input
            placeholder="Password"
            value={formData.password}
            onChangeText={(v) => onInputChange("password", v)}
            autoCapitalize="none"
            secureTextEntry
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </WideView>
        <WideView>
          <Button title="Sign in" onPress={handleLogin} loading={loading} disabled={loading} />
        </WideView>
      </Screen>
    )
  },
)
