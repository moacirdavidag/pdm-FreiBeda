import createValidator from "class-validator-formik";
import { Formik } from "formik";
import {
  Box,
  Center,
  FormControl,
  Heading,
  Input,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { TouchableOpacity } from "react-native";
import { Back } from "../components/Back";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { RegistrarGovernancaDTO } from "../dtos/governanca.dto";
import { api } from "../services/api";
import { getToken } from "../services/asyncStorage";
import { AxiosError } from "../types/axiosError";
import { NavigationProps } from "../types/navigation";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type Props = {
  navigation: NavigationProps;
  route: any;
};

export const GovernancaFormeEdit = ({ navigation, route }: Props) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("Governancas", route.params)}
        activeOpacity={0.8}
      >
        <Back text="Governança" />
      </TouchableOpacity>
      <ScrollView bg={"#ffffff"}>
        <Formik
          validate={createValidator(RegistrarGovernancaDTO)}
          initialValues={{ nome: "", cargo: "" }}
          onSubmit={async (values, { resetForm, setErrors }) => {
            try {
              const token = await getToken("@token");
              await api.put(
                `/governanca/atualizarGovernanca/${route.params.idGovernanca}`,
                {
                  nome: values.nome,
                  cargo: values.cargo,
                },
                {
                  headers: {
                    authorization: token,
                  },
                }
              );
              resetForm();
              Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Atenção",
                textBody: `Editado com sucesso`,
                button: "Ok",
                onPressButton() {
                  navigation.navigate("Governancas", {
                    ...route.params,
                    paramPropKey: "paramPropValue",
                  })
                  Dialog.hide();
                },
              });
            } catch (error) {
              const data = error as AxiosError;
              setErrors({
                cargo: data.response.data.message,
              });
            }
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Center w="100%">
              <Box safeArea p="2" w="100%" maxW="300" py="1/4">
                <Heading
                  size="lg"
                  color="coolGray.800"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  fontWeight="semibold"
                >
                  Editar Governança
                </Heading>
                <VStack space={5} mt="5">
                  <FormControl>
                    <FormControl.Label>Nome</FormControl.Label>
                    <Input
                      onBlur={handleBlur("nome")}
                      value={values.nome}
                      onChangeText={handleChange("nome")}
                      type="text"
                    />
                    {errors.nome && touched.nome ? (
                      <Text color={"warning.500"} fontSize="xs">
                        {errors.nome}
                      </Text>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Cargo</FormControl.Label>
                    <Input
                      onBlur={handleBlur("cargo")}
                      value={values.cargo}
                      onChangeText={handleChange("cargo")}
                      type="text"
                    />
                    {errors.cargo && touched.cargo ? (
                      <Text color={"warning.500"} fontSize="xs">
                        {errors.cargo}
                      </Text>
                    ) : null}
                  </FormControl>
                  <Button onPress={handleSubmit} text={"Editar"} />
                </VStack>
              </Box>
            </Center>
          )}
        </Formik>
      </ScrollView>
      <Footer navigation={navigation} page={"Dashboard"} />
    </>
  );
};
