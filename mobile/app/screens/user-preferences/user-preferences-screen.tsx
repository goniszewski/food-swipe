import React, { FC, useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import styled, { css } from "@emotion/native"
import { Screen } from "../../components"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Button, Text, Input, Header, Icon, CheckBox, Chip, FAB } from "react-native-elements"
import { useStores } from "../../models"
import Allergens from "../../constants/allergens.enum"

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
  allergensView: css`
    margin-top: 20px;
  `,
  allergensContainer: css`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  `,
  allergenItem: css`
    margin-right: 10px;
    margin-bottom: 5px;
  `,
}

export const UserPreferencesScreen: FC<StackScreenProps<NavigatorParamList, "login">> = observer(
  ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      name: "",
      defaultVegan: false,
      defaultVegetarian: false,
      allergyTo: [],
    })
    const [error, setError] = useState(null)

    const { userStore } = useStores()
    const { user } = userStore

    useEffect(() => {
      if (user?.login) {
        setFormData({
          name: user.name,
          defaultVegan: user.defaultVegan,
          defaultVegetarian: user.defaultVegetarian,
          allergyTo: user.allergyTo,
        })
      }
    }, [user])

    const handleUpdate = async () => {
      setLoading(true)
      const isOk = await userStore.updatePreferences(formData)

      setTimeout(() => {
        setLoading(false)

        if (!isOk) {
          setError("Some error occured.")
        }
      }, 2000)

      if (isOk) {
        setLoading(false)
      }
    }

    const onInputChange = (field: string, value: string | boolean | number) => {
      setFormData((prevState) => {
        return {
          ...prevState,
          [field]: value,
        }
      })
    }

    const onAllergyChange = (allergy: string) => {
      setFormData((prevState) => {
        return {
          ...prevState,
          allergyTo: prevState.allergyTo.includes(allergy)
            ? prevState.allergyTo.filter((a) => a !== allergy)
            : [...prevState.allergyTo, allergy],
        }
      })
    }

    return (
      <Screen style={styles.root} preset="fixed" statusBar={"dark-content"}>
        <Header
          backgroundColor={color.palette.white}
          leftComponent={{
            icon: "settings",
            style: { color: color.palette.black, fontSize: 20 },
            onPress: () => navigation.navigate("userPreferences"),
          }}
          centerComponent={{
            text: "User preferences",
            style: { color: color.palette.black, fontSize: 20 },
          }}
          rightComponent={{
            icon: "favorite",
            color: color.palette.black,
            onPress: () => navigation.navigate("favorites"),
          }}
        />
        <WideView>
          {/* <Text h3>Login: {user.login}</Text> */}
          <Input
            label="Login"
            value={user.login}
            autoCapitalize="none"
            disabled
            rightIcon={{
              type: "material-community",
              name: "lock",
              color: color.palette.lightGrey,
            }}
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <Input
            label="Displayed name"
            value={formData.name}
            onChangeText={(v) => onInputChange("name", v)}
            autoCapitalize="none"
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <CheckBox
            title="Only vegan"
            checked={formData.defaultVegan}
            onPress={() => onInputChange("defaultVegan", !formData.defaultVegan)}
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <CheckBox
            title="Only vegetarian"
            checked={formData.defaultVegetarian}
            onPress={() => onInputChange("defaultVegetarian", !formData.defaultVegetarian)}
          />
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <View style={styles.allergensView}>
            <Text h4>I'm allergic to</Text>
            <View style={styles.allergensContainer}>
              {Object.values(Allergens).map((allergy) => (
                <Chip
                  key={allergy}
                  title={allergy}
                  type={formData.allergyTo.includes(allergy) ? "solid" : "outline"}
                  style={styles.allergenItem}
                  onPress={() => onAllergyChange(allergy)}
                />
              ))}
            </View>
          </View>
        </WideView>
        <FAB
          title="Update"
          placement="right"
          color={color.palette.blue}
          onPress={handleUpdate}
          loading={loading}
          disabled={loading}
        />
      </Screen>
    )
  },
)
