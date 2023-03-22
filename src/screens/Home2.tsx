import React, { useCallback, useEffect, useState } from 'react';
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { StyleSheet, View, TextInput } from "react-native";
import { useTheme } from '../hooks';
import { Block, Button, Image, Input, Modal, Text } from '../components';
import { useGetProductsQuery } from '../services/apiQueries';
import { Products, Product, StoreAuth } from '../constants/types/index'
import { useSelector } from 'react-redux';



const Home = () => {
  const { assets, colors, gradients, sizes } = useTheme();
  const userData = useSelector((store: StoreAuth) => store.auth.userData)
  const token = useSelector((store: StoreAuth) => store.auth.token)
  const { data: products, isSuccess: isSuccessProducts, isLoading: isLoadingProducts, isError: isErrorProducts, error: errorProducts } = useGetProductsQuery({ sessionid: userData.sessionid, operatorid: userData.id, token })
  const [productList, setProductList] = useState([]);
  const [productSelected, setProductSelected] = useState({ id: 0, title: 'seleccione un producto' });

  useEffect(() => {
    const productFormated: any = []
    if (isSuccessProducts) {
      if (products.success) {
        products?.result?.map((product: any) => {
          productFormated.push({ productid: product.productid, productname: product.productname })
        })
        setProductList(productFormated)
      }
    }
  }, [products])

  if (isErrorProducts) {
    console.log("Error al obtener productos", errorProducts)
  }

  return (
    <View>
      {/* <Block row justify="space-between" marginBottom={sizes.base}> */}
        <Text>Operadores</Text>
        <Picker selectedValue={productSelected} onValueChange={(value) => {
          setProductSelected(value)
          console.log("seleccionada: ", value)
        }}>
          {productList.map((item: any, index) => (
            <PickerIOS.Item
              label={item.productname}
              value={item}
              key={`product-item-${index}`}
            />
          ))}
        </Picker>
      {/* </Block> */}
    </View>
  )
}

export default Home;
