import React, { useCallback, useEffect, useState } from 'react';
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View, TextInput } from "react-native";
import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Input, Product, Text } from '../components';
import { BLEPrinter, NetPrinter, USBPrinter, IUSBPrinter, IBLEPrinter, INetPrinter } from "react-native-thermal-receipt-printer";

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
}

interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

const Home = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const { following, trending } = useData();
  const [products, setProducts] = useState(following);
  const { assets, colors, fonts, gradients, sizes } = useTheme();

  const [selectedValue, setSelectedValue] = React.useState<keyof typeof printerList>("ble")
  const [devices, setDevices] = React.useState([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>({})

  useEffect(() => {
    const getListDevices = async () => {
      const Printer = printerList[selectedValue];
      // get list device for net printers is support scanning in local ip but not recommended
      if (selectedValue === "net") return
      // try {
      //   setLoading(true)
      //   await Printer.init()
      //   const results = await Printer.getDeviceList();
      //   setDevices(
      //     results.map((item: any) => ({ ...item, printerType: selectedValue }))
      //   );
      // } catch (err) {
      //   console.warn(err)
      // } finally {
      //   setLoading(false)
      // }

    };
    getListDevices()
  }, [selectedValue])

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        setLoading(true);
        switch (selectedPrinter.printerType) {
          case "ble":
            await BLEPrinter.connectPrinter(
              selectedPrinter?.inner_mac_address || ""
            ).then(result => {
              console.log(result || "")
            }
            );
            break;
          case "net":
            await NetPrinter.connectPrinter(
              "192.168.1.100",
              9100
            );
            break;
          case "usb":
            await USBPrinter.connectPrinter(
              selectedPrinter?.vendor_id || "",
              selectedPrinter?.product_id || ""
            )
            break;
          default:
        }
      } catch (err) {
        console.warn(err)
      } finally {
        setLoading(false)
      }
    };
    connect();
  };

  const handlePrint = async () => {
    try {
      // [options valueForKey:@"imageWidth"];
      const Printer = printerList[selectedValue];
      console.log("Impresora seleccionada para imprimir:", Printer)

      await Printer.printImage("https://cdn-icons-png.flaticon.com/512/71/71657.png", { imageWidth: 300, paddingX: 100 })
        .then(result => {
          console.log("Resultado de print image:", result)

        }).catch(error => {
          console.log("error capturado en imagen:", error)

        })
      await Printer.printText("Hola Eduardo\n Esto es una prueba")
        .then(result => {
          console.log("Resultado de print text:", result)

        })
    } catch (err) {
      console.warn("Error en trycatch handlePrint", err)
    }
  };

  const handleChangePrinterType = async (type: keyof typeof printerList) => {
    setSelectedValue((prev) => {
      printerList[prev].closeConn()
      return type
    });
    setSelectedPrinter({})
  };

  const handleChangeHostAndPort = (params: string) => (text: string) =>
    setSelectedPrinter((prev) => ({
      ...prev,
      device_name: "Net Printer",
      [params]: text,
      printerType: "net"
    }))

  const _renderNet = () => (
    <View style={{ paddingVertical: 16 }}>
      <View style={styles.rowDirection}>
        <Text>Host: </Text>
        <TextInput
          placeholder="192.168.100.19"
          onChangeText={handleChangeHostAndPort("host")}
        />
      </View>
      <View style={styles.rowDirection}>
        <Text>Port: </Text>
        <TextInput
          placeholder="9100"
          onChangeText={handleChangeHostAndPort("port")}
        />
      </View>
    </View>
  )

  const _renderOther = () => (
    <Picker selectedValue={selectedPrinter} onValueChange={setSelectedPrinter}>
      {devices.map((item: any, index) => (
        <Picker.Item
          label={item.device_name}
          value={item}
          key={`printer-item-${index}`}
        />
      ))}
    </Picker>
  )

  return (
    <Block>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Select printer type: </Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={handleChangePrinterType}
          >
            {Object.keys(printerList).map((item, index) => (
              <Picker.Item
                label={item.toUpperCase()}
                value={item}
                key={`printer-type-item-${index}`}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.section}>
          <Text>Select printer: </Text>
          {selectedValue === "net" ? _renderNet() : _renderOther()}
        </View>
        <Button
          disabled={!selectedPrinter?.device_name}
          onPress={handleConnectSelectedPrinter}
        />
        <Button
          disabled={!selectedPrinter?.device_name}
          onPress={handlePrint}
        />

      </View>
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
