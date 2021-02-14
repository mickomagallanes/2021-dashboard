import React from 'react';

const PlainPageLayout = (Component) => {

    return class extends React.Component {

        render() {
            return (
                <div className="container-scroller">
                    <div className="container-fluid page-body-wrapper full-page-wrapper">
                        <div className="main-panel">
                            <div className="content-wrapper">
                                <Component />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

}

export default PlainPageLayout;