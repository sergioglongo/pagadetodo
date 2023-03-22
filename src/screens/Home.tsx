import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import { useData, useTheme } from '../hooks';
import { StoreAuth } from '../constants/types';
import { Block, Button, Text, Image, Input } from '../components';
import { useSelector } from 'react-redux';
import { useGetProductsQuery, useDoCargaMutation, useLazyGetSaldoClienteQuery } from '../services/apiQueries';
import { useNavigation } from '@react-navigation/core';

interface ProductList {
  productid: string;
  productname: string;
}

const logos = [
  { productid: '76', logo: (require('../assets/logos/claro.png')) },
  { productid: '80', logo: (require('../assets/logos/directv.png')) },
  { productid: '77', logo: (require('../assets/logos/movistar.png')) },
  { productid: '78', logo: (require('../assets/logos/nextel.png')) },
  { productid: '75', logo: (require('../assets/logos/personal.png')) },
  { productid: '81', logo: (require('../assets/logos/tuenti.jpg')) },
];

const Home = () => {
  const data = useData();
  const { colors, sizes } = useTheme();

  const userData = useSelector((store: StoreAuth) => store.auth.userData)
  const token = useSelector((store: StoreAuth) => store.auth.token)
  const { data: products, isSuccess: isSuccessProducts, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useGetProductsQuery({ sessionid: userData.sessionid, operatorid: userData.id, token })
  const [getSaldo, { data: saldo, isSuccess: isSuccessSaldo, isLoading: isLoadingSaldo, isError: isErrorSaldo, error: errorSaldo }] = useLazyGetSaldoClienteQuery()
  const [productList, setProductList] = useState([])
  const [productSelected, setProductSelected] = useState<ProductList>()
  const [rechargeData, setRechargeData] = useState({ number: '', amount: '', productid: '' })
  const [balance, setBalance] = useState(userData ? userData?.bolsa : '-')
  const [inputsError, setInputsError] = useState({ number: false, amount: false, productid: false })
  const [doCarga, { data: carga, isSuccess: isSuccessCarga, isLoading: isLoadingCarga, isError: isErrorCarga, error: errorCarga }] = useDoCargaMutation()
  const navigation = useNavigation();
  const IMAGE_SIZE = (sizes.width - (sizes.sm) * 5) / 3;


  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: 'orange'
      }
    });
  }, [navigation]);

  useEffect(() => {
    const productFormated: any = []
    if (isSuccessProducts) {
      if (products.success) {
        products?.result?.map((product: any) => {
          productFormated.push({ productid: product.productid, productname: product.productname })
        })
        setProductList(productFormated)
        setProductSelected(productFormated[0])
        setRechargeData({ ...rechargeData, productid: productFormated[0].productid })
      }
    }
  }, [products])

  const handleErrors = () => {
    setInputsError({
      number: Boolean(!rechargeData?.number || rechargeData?.number === ''),
      amount: Boolean(!rechargeData?.amount || rechargeData?.amount === ''),
      productid: Boolean(!rechargeData?.productid),
    });
  }

  const handleProductSelect = (product: ProductList) => {
    setProductSelected(product)
    setRechargeData({ ...rechargeData, productid: product?.productid })
  }

  const logoSearch = (productid: string) => {
    let logo = ''
    logos?.map((item) => {
      if (item.productid === productid) {
        logo = item.logo
      }
    })
    return logo
  }

  const handleChange = (target = {}) => {
    setRechargeData({ ...rechargeData, ...target })
    handleErrors()
  }
  const handleSubmit = () => {
    handleErrors()
    if (!rechargeData?.number || !rechargeData?.amount || !rechargeData?.productid) {
      console.log("Faltan datos")
      Alert.alert(
        "Faltan datos",
        `Hay datos que no fueron completados. ${inputsError.number ? "\nCampo numero es requerido" : ''}  ${inputsError.amount ? "\nCampo monto es requerido " : ''}`,
        [{ text: "OK" }]
      )
      return;
    }
    const data = {
      access_token: token,
      pvid: userData.id,
      sessionid: userData.sessionid,
      productid: rechargeData.productid,
      numero: rechargeData.number,
      importe: rechargeData.amount
    }
    doCarga(data)
  }

  useEffect(() => {
    if (isSuccessCarga) {
      if (carga?.success) {
        console.log("La carga fue exitosa:", carga)
        Alert.alert(
          "Carga realizada",
          `Se realizo la carga de $${carga?.result?.IMPORTE} al numero ${carga?.result?.TEL} de la empresa ${carga?.result?.EMPRESA}. \nNro de Operación ${carga?.result?.NROOP}`,
          [{ text: "OK" }]
        )
        setRechargeData({ number: '', amount: '', productid: rechargeData.productid })
        getSaldo({ sessionid: userData.sessionid, operatorid: userData.id, token })
      } else {
        console.log("Hubo un error al intentar realizar la carga", carga)
      }
    }
  }, [carga])

  useEffect(() => {
    if (isSuccessSaldo) {
      if (saldo?.success) {
        console.log("Saldo Obtenido:", saldo?.result?.saldo_bolsa)
        setBalance(saldo?.result?.saldo_bolsa)
        // setRechargeData({ number: '', amount: '', productid: rechargeData.productid })
      } else {
        console.log("Hubo un error al obtener saldo", carga)
      }
    }
  }, [saldo])


  if (isErrorCarga) {
    console.log("Error al cargar", errorCarga)

  }

  if (isErrorSaldo) {
    console.log("Error en saldo", errorSaldo)

  }
  return (
    <Block scroll style={{ backgroundColor: 'orange' }}>
      <Block
        // behavior={'height'}
        marginTop={10}
        marginHorizontal="3%"
        scroll
        style={{ maxHeight: 420 }}
        renderToHardwareTextureAndroid
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: -sizes.padding, y: 0 }}
      >
        <Block card style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }}>
          {productList?.map((product: ProductList) => {
            // const isSelected = product?.productid === productSelected?.productid;
            return (
              <Button
                radius={10}
                marginVertical={5}
                marginHorizontal={sizes.s}
                key={`product-${product?.productid}}`}
                onPress={() => handleProductSelect(product)}
                style={{ borderWidth: productSelected?.productid === product?.productid ? 2 : 0, borderColor: '#fda97b' }}>
                <Image
                  resizeMode='contain'
                  source={logoSearch(product?.productid)}
                  style={{
                    height: IMAGE_SIZE,
                    width: IMAGE_SIZE,
                  }}
                />
              </Button>
            )
          })}
        </Block>
      </Block>
      <Block keyboard keyboardShouldPersistTaps='always' behavior={'height'} marginTop={10} marginBottom={10}>
        <Block flex={0} marginHorizontal="3%" card >
          <Block
            blur
            flex={0}
            intensity={60}
            radius={4}
            overflow="hidden"
            justify="space-evenly"
            tint={colors.blurTint}
            paddingVertical={sizes.sm}
          >
            <Block flex={1} paddingHorizontal={sizes.m}>
              <Input id='number'
                value={rechargeData.number}
                autoCapitalize="none"
                marginBottom={sizes.m}
                label={'Numero'}
                placeholder="Ingrese el numero..."
                success={Boolean(rechargeData.number)}
                danger={Boolean(inputsError.number)}
                onChangeText={(value) => handleChange({ number: value })}
              />
              <Block style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Input id='amount'
                  value={rechargeData.amount}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Monto'}
                  style={{width:'60%'}}
                  placeholder="Ingrese el monto..."
                  success={Boolean(rechargeData.amount)}
                  danger={Boolean(inputsError.amount)}
                  onChangeText={(value) => handleChange({ amount: value })}
                />
                <Input id='available'
                  value={balance}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Disponible'}
                  style={{width:'35%'}}
                  color='gray'
                  textAlign='center'
                  disabled
                />
              </Block>
            </Block>
            <Button
              marginHorizontal={sizes.sm}
              onPress={handleSubmit}
              color={'#fc5c04'}>
              {false ?
                <ActivityIndicator size={20} color='#1c54a4' />
                :
                <Text bold primary transform="uppercase" color={'#1c54a4'}>
                  Cargar
                </Text>
              }
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16
  },
  section: {
    flex: 1
  },
  rowDirection: {
    flexDirection: "row"
  }
})

export default Home;
