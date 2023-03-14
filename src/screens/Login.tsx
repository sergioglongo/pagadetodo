/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useLayoutEffect, useState,useEffect } from 'react';
import { ActivityIndicator, Alert, Animated, Linking, Platform, TouchableOpacity } from 'react-native';

import { useData, useTheme, useTranslation } from '../hooks';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox } from '../components';
import { useLazyGetTokenQuery, useLazyLoginQuery } from '../services/apiQueries';
import { useDispatch } from 'react-redux';
import { handleLogin } from '../redux/authentication';


const isAndroid = Platform.OS === 'android';

const Login = ({navigation}) => {
  const { isDark } = useData()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [inputsError, setInputsError] = useState({
    username: false,
    password: false,
  });
  const { assets, colors, sizes } = useTheme();
  const [getToken, { data: token, isSuccess: isSuccessToken, isLoading: isLoadingToken, isError: isErrorToken, error: errorToken }] = useLazyGetTokenQuery()
  const [getLogin, { data: login, isSuccess: isSuccessLogin, isLoading: isLoadingLogin, isError: isErrorLogin, error: errorLogin }] = useLazyLoginQuery()


  useEffect(() => {
    getToken()  
  }, [])
  

  if (isErrorToken) {
    console.log("No se obtuvo token", errorToken)
  }

  if (isSuccessLogin) {
    if (login.result) {
      dispatch(handleLogin({token: token.access_token, sessionid: login.result.login.sessionid, userData: login.result.login}))
      navigation.replace("Menu")
    } else {
    console.log("Datos erroneos", login)
    }
  }
  if (isErrorLogin) {
    console.log("Login Incorrecto", errorLogin)
  }

  const handleChange = (target = {}) => setLoginData({ ...loginData, ...target });

  const loginHandler = async () => {
    setInputsError({
      password: !loginData?.password,
      username: !loginData?.username,
    });
    if (!loginData?.password || !loginData?.username) {
      return;
    } else {
      if(isSuccessToken){
        getLogin({token: token.access_token, username: loginData?.username, password: loginData?.password})
      }
    }
  };

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>      
           <Image 
           background
           resizeMode="contain"
            source={assets.logo} 
            padding={sizes.sm}
            radius={sizes.cardRadius}
            height={sizes.height * 0.3}
            >
            </Image> 
        </Block>
        {/* register form */}
        <Block
          keyboard
          keyboardShouldPersistTaps='always'
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.080 - sizes.l)}>
          <Block
            flex={0}
            radius={4}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={4}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}
              style={{borderWidth:0.5, borderColor:'#0B3D5C'}}>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  value={loginData.username}
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.email')}
                  keyboardType="email-address"
                  placeholder="Ingrese su mail..."
                  success={Boolean(loginData.username)}
                  danger={Boolean(loginData.username && inputsError.username)}
                  onChangeText={(value) => handleChange({ username: value })}
                />
                <Input
                  value={loginData.password}
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label="Contraseña"
                  placeholder="Ingrese su contraseña"
                  onChangeText={(value) => handleChange({ password: value })}
                  success={Boolean(loginData.password)}
                  danger={Boolean(loginData.password && inputsError.password)}
                />
              </Block>
              {/* <TouchableOpacity onPress={()=>{navigation.navigate('ResetPasword')}}>
                <Text
                  semibold
                  center
                  marginBottom={20}
                  style={{ textDecorationLine: 'underline' }}
                >
                  ¿Olvidaste tu contraseña? 
                </Text>
              </TouchableOpacity> */}
              <Button
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={loginHandler}
                color={'#44d62c'}>
                {isLoadingLogin ?
                  <ActivityIndicator size={20} color='#0B3D5C'/>
                  :
                  <Text bold primary transform="uppercase" color={'#0B3D5C'}>
                    Ingresar
                  </Text>
                }
              </Button>
              <Text
                semibold
                center
                marginBottom={20}
                marginTop={20}
                style={{ textDecorationLine: 'underline' }}
              // onPress={() => {
              //   Linking.openURL('https://www.creative-tim.com/terms');
              // }}
              >
                {/* ¿Todavía no estás registrado? */}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Login;
