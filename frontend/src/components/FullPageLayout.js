import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';

const FullPageLayout = (Component) => {

    return class extends React.Component {

        render() {
            <div className="container-scroller">
                <Sidebar />
                <div className="container-fluid page-body-wrapper">
                    <Navbar />
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <Component />
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>

        }
    }

}

export default FullPageLayout;