import './globals.css';
import Routes from '../components/Routes';
export const metadata = {
    title: 'Virtual Herbal Garden',
    description: 'Explore the world of medicinal plants.',
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/logo.ico"/>
            </head>        
            <body>
                <Routes />
                <main>{children}</main>
            </body>
        </html>
    );
};

export default RootLayout;
