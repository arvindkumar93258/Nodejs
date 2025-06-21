import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';  // Changed import
import { useLocation, useNavigate } from 'react-router-dom';

const Setup2FA = () => {
    const [secret, setSecret] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || '';

    useEffect(() => {
        if (email) {
            generate2FASecret();
        } else {
            navigate('/register');
        }
    }, [email, navigate]);

    const generate2FASecret = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/generate-2fa', {
                email
            });
            setSecret(response.data.secret);
            setQrCodeUrl(response.data.qrCodeUrl);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error generating 2FA secret');
        }
    };

    const verify2FASetup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/verify-2fa-setup', {
                email,
                token,
                secret
            });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error verifying 2FA setup');
        }
    };

    return (
        <div>
            <h2>Setup Two-Factor Authentication</h2>
            <p>Scan the QR code with Google Authenticator or Microsoft Authenticator</p>

            {qrCodeUrl && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    maxWidth: '300px',
                    margin: '0 auto'
                }}>
                    {secret && (
                        <>
                            <div style={{
                                padding: '16px',
                                backgroundColor: 'white',
                                border: '1px solid #eee',
                                borderRadius: '4px'
                            }}>
                                <QRCodeSVG
                                    value={`otpauth://totp/MyApp:${encodeURIComponent(email)}?secret=${secret}&issuer=MyApp`}
                                    size={200}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#FFFFFF"
                                    fgColor="#000000"
                                />
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '14px',
                                color: '#333'
                            }}>
                                <p style={{
                                    marginBottom: '8px',
                                    fontWeight: 'bold'
                                }}>
                                    Can't scan the QR code?
                                </p>
                                <div style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    wordBreak: 'break-all',
                                    fontFamily: 'monospace'
                                }}>
                                    {secret}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(secret);
                                        alert('Secret key copied to clipboard!');
                                    }}
                                    style={{
                                        marginTop: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    Copy Secret Key
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            <form onSubmit={verify2FASetup}>
                <div>
                    <label>Enter 6-digit code from your app:</label>
                    <input
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Verify and Enable 2FA</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Setup2FA;