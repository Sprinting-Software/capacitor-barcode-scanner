'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');
var html5Qrcode = require('html5-qrcode');

/**
 * Enum representing the direction of the camera to be used for barcode scanning.
 */
exports.CapacitorBarcodeScannerCameraDirection = void 0;
(function (CapacitorBarcodeScannerCameraDirection) {
    CapacitorBarcodeScannerCameraDirection[CapacitorBarcodeScannerCameraDirection["BACK"] = 1] = "BACK";
    CapacitorBarcodeScannerCameraDirection[CapacitorBarcodeScannerCameraDirection["FRONT"] = 2] = "FRONT";
})(exports.CapacitorBarcodeScannerCameraDirection || (exports.CapacitorBarcodeScannerCameraDirection = {}));
/**
 * Enum representing the orientation of the scanner during barcode scanning.
 */
exports.CapacitorBarcodeScannerScanOrientation = void 0;
(function (CapacitorBarcodeScannerScanOrientation) {
    CapacitorBarcodeScannerScanOrientation[CapacitorBarcodeScannerScanOrientation["PORTRAIT"] = 1] = "PORTRAIT";
    CapacitorBarcodeScannerScanOrientation[CapacitorBarcodeScannerScanOrientation["LANDSCAPE"] = 2] = "LANDSCAPE";
    CapacitorBarcodeScannerScanOrientation[CapacitorBarcodeScannerScanOrientation["ADAPTIVE"] = 3] = "ADAPTIVE";
})(exports.CapacitorBarcodeScannerScanOrientation || (exports.CapacitorBarcodeScannerScanOrientation = {}));
/**
 * Enum representing a special option to indicate that all barcode types are supported.
 */
exports.CapacitorBarcodeScannerTypeHintALLOption = void 0;
(function (CapacitorBarcodeScannerTypeHintALLOption) {
    CapacitorBarcodeScannerTypeHintALLOption[CapacitorBarcodeScannerTypeHintALLOption["ALL"] = 17] = "ALL";
})(exports.CapacitorBarcodeScannerTypeHintALLOption || (exports.CapacitorBarcodeScannerTypeHintALLOption = {}));
/**
 * Extends supported formats from Html5Qrcode with a special 'ALL' option,
 * indicating support for all barcode types.
 */
const CapacitorBarcodeScannerTypeHint = Object.assign(Object.assign({}, html5Qrcode.Html5QrcodeSupportedFormats), exports.CapacitorBarcodeScannerTypeHintALLOption);
/**
 * Enum representing the library to be used for barcode scanning on Android devices.
 */
exports.CapacitorBarcodeScannerAndroidScanningLibrary = void 0;
(function (CapacitorBarcodeScannerAndroidScanningLibrary) {
    CapacitorBarcodeScannerAndroidScanningLibrary["ZXING"] = "zxing";
    CapacitorBarcodeScannerAndroidScanningLibrary["MLKIT"] = "mlkit";
})(exports.CapacitorBarcodeScannerAndroidScanningLibrary || (exports.CapacitorBarcodeScannerAndroidScanningLibrary = {}));

/**
 * Predefined CSS rules for styling barcode scanner components.
 * Each object in the array defines a CSS rule, with a selector and the CSS properties to apply.
 */
const barcodeScannerCss = [
    { selector: '.scanner-container-display', css: 'display: block;' },
    {
        selector: '.scanner-dialog',
        css: 'display: none; position: fixed; z-index: 999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);',
    },
    {
        selector: '.scanner-dialog-inner',
        css: 'background-color: #fefefe; margin: 2% auto; padding: 20px; border: 1px solid #888; width: 96%;',
    },
    { selector: '.close-button', css: 'color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;' },
    { selector: '.close-button:hover', css: 'color: #222;' },
    { selector: '.scanner-container-full-width', css: 'width: 100%;' },
];
/**
 * Dynamically applies a set of CSS rules to the document.
 * If a custom style element with a specific ID does not exist, it is created and appended to the document's head.
 * Existing rules in the style element are cleared before new ones are applied.
 * This function supports both modern and older browsers by using `CSSStyleSheet.insertRule` and `textContent` respectively.
 *
 * @param {Array<{selector: string, css: string}>} cssRules - An array of objects containing CSS selectors and styles to apply.
 */
function applyCss(cssRules) {
    const styleId = 'custom-style-os-cap-barcode'; // Unique identifier for the style element.
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
        // Create and append a new style element if it does not exist.
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }
    if (styleElement.sheet) {
        // Clear existing CSS rules.
        while (styleElement.sheet.cssRules.length) {
            styleElement.sheet.deleteRule(0);
        }
        // Insert new CSS rules.
        for (const { selector, css } of cssRules) {
            styleElement.sheet.insertRule(`${selector} { ${css} }`);
        }
    }
    else {
        // Fallback for older browsers using textContent.
        styleElement.textContent = '';
        for (const { selector, css } of cssRules) {
            styleElement.textContent += `${selector} { ${css} }`;
        }
    }
}

/**
 * Registers the `OSBarcode` plugin with Capacitor.
 * For web platforms, it applies necessary CSS for the barcode scanner and dynamically imports the web implementation.
 * This allows for lazy loading of the web code only when needed, optimizing overall bundle size.
 */
const CapacitorBarcodeScannerImpl = core.registerPlugin('CapacitorBarcodeScanner', {
    web: () => {
        applyCss(barcodeScannerCss); // Apply the CSS styles necessary for the web implementation of the barcode scanner.
        return Promise.resolve().then(function () { return web; }).then((m) => new m.CapacitorBarcodeScannerWeb()); // Dynamically import the web implementation and instantiate it.
    },
});
class CapacitorBarcodeScanner {
    static async scanBarcode(options) {
        options.scanInstructions = options.scanInstructions || ' '; // Ensure scanInstructions is at least a space.
        options.scanButton = options.scanButton || false; // Set scanButton to false if not provided.
        options.scanText = options.scanText || ' '; // Ensure scanText is at least a space.
        options.cameraDirection = options.cameraDirection || exports.CapacitorBarcodeScannerCameraDirection.BACK; // Set cameraDirection to 'BACK' if not provided.
        options.scanOrientation = options.scanOrientation || exports.CapacitorBarcodeScannerScanOrientation.ADAPTIVE; // Set scanOrientation to 'ADAPTIVE' if not provided.
        return CapacitorBarcodeScannerImpl.scanBarcode(options);
    }
}

/**
 * Implements OSBarcodePlugin to provide web functionality for barcode scanning.
 */
class CapacitorBarcodeScannerWeb extends core.WebPlugin {
    /**
     * Stops the barcode scanner and hides its UI.
     * @private
     * @returns {Promise<void>} A promise that resolves when the scanner has stopped and its UI is hidden.
     */
    async stopAndHideScanner() {
        console.log(window.OSBarcodeWebScanner);
        if (window.OSBarcodeWebScanner) {
            await window.OSBarcodeWebScanner.stop();
            window.OSBarcodeWebScanner = null;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('cap-os-barcode-scanner-container-dialog').style.display = 'none';
    }
    /**
     * Builds the HTML elements necessary for the barcode scanner UI.
     * This method checks if the scanner container exists before creating it to avoid duplicates.
     * It also sets up the close button to stop and hide the scanner on click.
     * @private
     */
    buildScannerElement() {
        if (document.getElementById('cap-os-barcode-scanner-container')) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            document.getElementById('cap-os-barcode-scanner-container').className = 'scanner-container-display';
            return;
        }
        // Create and configure scanner container elements
        const caposbarcodescannercontainer = document.body.appendChild(document.createElement('div'));
        caposbarcodescannercontainer.id = 'cap-os-barcode-scanner-container';
        const caposbarcodescannercontainerdialog = document.createElement('div');
        caposbarcodescannercontainerdialog.id = 'cap-os-barcode-scanner-container-dialog';
        caposbarcodescannercontainerdialog.className = 'scanner-dialog';
        // Inner dialog elements including the close button and scanner view
        const caposbarcodescannercontainerdialoginner = document.createElement('div');
        caposbarcodescannercontainerdialoginner.className = 'scanner-dialog-inner';
        const caposbarcodescannercontainerdialoginnerclose = document.createElement('span');
        caposbarcodescannercontainerdialoginnerclose.className = 'close-button';
        caposbarcodescannercontainerdialoginnerclose.innerHTML = '&times;';
        caposbarcodescannercontainerdialoginner.appendChild(caposbarcodescannercontainerdialoginnerclose);
        const caposbarcodescannercontainerdialoginnercontainerp = document.createElement('p');
        caposbarcodescannercontainerdialoginnercontainerp.innerHTML = '&nbsp;';
        caposbarcodescannercontainerdialoginner.appendChild(caposbarcodescannercontainerdialoginnercontainerp);
        const caposbarcodescannercontainerdialoginnercontainer = document.createElement('div');
        caposbarcodescannercontainerdialoginnercontainer.className = 'scanner-container-full-width';
        caposbarcodescannercontainerdialoginnercontainer.id = 'cap-os-barcode-scanner-container-scanner';
        caposbarcodescannercontainerdialoginner.appendChild(caposbarcodescannercontainerdialoginnercontainer);
        caposbarcodescannercontainerdialog.appendChild(caposbarcodescannercontainerdialoginner);
        caposbarcodescannercontainer.appendChild(caposbarcodescannercontainerdialog);
        caposbarcodescannercontainerdialoginnerclose.onclick = this.stopAndHideScanner;
    }
    /**
     * Initiates a barcode scan using the user's camera and HTML5 QR code scanner.
     * Displays the scanner UI and waits for a scan to complete or fail.
     * @param {OSBarcodeScanOptions} options Configuration options for the scan, including camera direction and UI preferences.
     * @returns {Promise<OSBarcodeScanResult>} A promise that resolves with the scan result or rejects with an error.
     */
    async scanBarcode(options) {
        this.buildScannerElement();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        document.getElementById('cap-os-barcode-scanner-container-dialog').style.display = 'block';
        return new Promise((resolve, reject) => {
            var _a, _b;
            const param = {
                facingMode: options.cameraDirection === 1 ? 'environment' : 'user',
                hasScannerButton: false,
                scanButton: options.scanButton === undefined ? false : options.scanButton,
                showScanLine: false,
                scanInstructions: options.scanInstructions ? options.scanInstructions : '',
                orientation: options.scanOrientation
                    ? options.scanOrientation
                    : exports.CapacitorBarcodeScannerScanOrientation.PORTRAIT,
                showCameraSelection: ((_a = options.web) === null || _a === void 0 ? void 0 : _a.showCameraSelection) ? options.web.showCameraSelection : false,
                typeHint: options.hint === 17 ? undefined : options.hint,
                scannerFPS: ((_b = options.web) === null || _b === void 0 ? void 0 : _b.scannerFPS) ? options.web.scannerFPS : 50,
            };
            // Set up and start the scanner
            const scannerElement = document.getElementById('cap-os-barcode-scanner-container-scanner');
            if (!scannerElement) {
                throw new Error('Scanner Element is required for web');
            }
            window.OSBarcodeWebScanner = new html5Qrcode.Html5Qrcode(scannerElement.id);
            const Html5QrcodeConfig = {
                fps: param.scannerFPS,
                qrbox: scannerElement.getBoundingClientRect().width * (9 / 16) - 10,
                aspectRatio: 16 / 9,
                videoConstraints: {
                    focusMode: 'continuous',
                    height: { min: 576, ideal: 1920 },
                    deviceId: undefined,
                    facingMode: undefined,
                },
            };
            // Success and error callbacks for the scanner
            const OSBarcodeWebScannerSuccessCallback = (decodedText, _decodedResult) => {
                this.stopAndHideScanner();
                resolve({ ScanResult: decodedText });
            };
            const OSBarcodeWebScannerErrorCallback = (error) => {
                if (error.indexOf('NotFoundException') === -1) {
                    this.stopAndHideScanner();
                    console.error(`[Scanner Web Error] ${error}`);
                    reject(error);
                }
            };
            window.OSBarcodeWebScanner.start({ facingMode: param.facingMode }, Html5QrcodeConfig, OSBarcodeWebScannerSuccessCallback, OSBarcodeWebScannerErrorCallback);
        });
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CapacitorBarcodeScannerWeb: CapacitorBarcodeScannerWeb
});

exports.CapacitorBarcodeScanner = CapacitorBarcodeScanner;
exports.CapacitorBarcodeScannerTypeHint = CapacitorBarcodeScannerTypeHint;
//# sourceMappingURL=plugin.cjs.js.map
