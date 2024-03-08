import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint, CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerAndroidScanningLibrary } from '@capacitor/barcode-scanner';

const Home: React.FC = () => {
  const [scannerResult, setScannerResult] = useState<string>('No Data...');

  const scanBarcode = async () => {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
      scanInstructions: 'Hold your device over the barcode to scan.',
      scanButton: true, // TODO: Not implemented yet in the web implementation
      scanText: 'Press To Start Scanning', // TODO: Not implemented yet in the web implementation
      cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK, 
      scanOrientation: CapacitorBarcodeScannerScanOrientation.ADAPTIVE, // TODO: Not implemented yet in the web implementation
      android: {
        scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT,
      },
      web: {
        showCameraSelection: false, // TODO: Not implemented yet in the web implementation
        scannerFPS: 30
      }
    });
    setScannerResult(result.ScanResult);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Barcode Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{marginTop: '5px'}}></div>
        <IonInput value={scannerResult} label="Scanner Result" labelPlacement="floating" readonly={true} fill="outline" placeholder="No Data..."></IonInput>
        <IonButton onClick={scanBarcode}>Scan</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
