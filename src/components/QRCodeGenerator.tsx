import { useEffect, useState } from 'react';
import * as QRCode from 'qrcode';

const QRCodeGenerator = ({ url }: { url: string }) => {
    const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const dataURL = await QRCode.toDataURL(url);
                setQRCodeDataURL(dataURL);
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        };

        generateQRCode();
    }, [url]);

    return (
        <div>
            {qrCodeDataURL ? (
                <img src={qrCodeDataURL} alt="QR Code" />
            ) : (
                <p>Generacion del QR Code...</p>
            )}
        </div>
    );
};

export default QRCodeGenerator;
