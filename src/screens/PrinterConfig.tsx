import React, { useEffect } from 'react';
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";
import { useData, useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Input, Product, Text } from '../components';
import { BLEPrinter, NetPrinter, USBPrinter, IUSBPrinter, IBLEPrinter, INetPrinter } from "react-native-thermal-receipt-printer";
// import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';

const printerList: Record<string, any> = {
  ble: BLEPrinter,
  net: NetPrinter,
  usb: USBPrinter,
}

interface SelectedPrinter
  extends Partial<IUSBPrinter & IBLEPrinter & INetPrinter> {
  printerType?: keyof typeof printerList;
}

const PrinterConfig = () => {
  const { t } = useTranslation();
  const { assets, colors, fonts, gradients, sizes } = useTheme();

  const [devices, setDevices] = React.useState([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [selectedPrinter, setSelectedPrinter] = React.useState<SelectedPrinter>({})

  const getListDevices = async () => {
    const Printer = printerList['ble'];
    // get list device for net printers is support scanning in local ip but not recommended
    try {
      setLoading(true)
      await Printer.init()
      const results = await Printer.getDeviceList();
      setDevices(
        results.map((item: any) => ({ ...item, printerType: 'ble' }))
      );
    } catch (err) {
      console.warn(err)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getListDevices()
  }, [])

  const handleConnectSelectedPrinter = () => {
    if (!selectedPrinter) return;
    const connect = async () => {
      try {
        setLoading(true);
        await BLEPrinter.connectPrinter(
              selectedPrinter?.inner_mac_address || ""
            )
      } catch (err) {
        console.warn(err)
      } finally {
        setLoading(false)
      }
    };
    connect()
  };

  const handlePrint = async () => {
    try {
      // [options valueForKey:@"imageWidth"];
      const Printer = printerList['ble'];
      await 
      // Printer.printText("Hola Eduardo\n Esto es una prueba")
      Printer.printText(`<C>BILLING</C>\n<C><D>Encabezado</D></C>\n<C>090 3399 031 555</C>`);
          // Printer.printText(`Date : 15- 09 - 2021 /15 : 29 : 57 / Admin`);
          // Printer.printText(`Product : Total - 4 / No. (1,2,3,4)\n`);
          
    } catch (err) {
      console.warn("Error en trycatch handlePrint", err)
    }
  };

  const _renderOther = () => (
    <Picker selectedValue={selectedPrinter} onValueChange={(value) => {
      setSelectedPrinter(value)
      console.log("seleccionada: ", value)

    }}>
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
          <Text>Select printer: </Text>
          {_renderOther()}
        </View>
        <Button
          // disabled={!selectedPrinter?.device_name}
          onPress={handleConnectSelectedPrinter}
        >
          <Text>Connect</Text>
        </Button>
        <Button
          // disabled={!selectedPrinter?.device_name}
          onPress={handlePrint}
        >
          <Text>Print Test</Text>
        </Button>

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

export default PrinterConfig;
