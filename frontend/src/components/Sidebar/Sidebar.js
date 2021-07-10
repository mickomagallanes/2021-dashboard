import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import logo from "../../assets/images/logo.svg";
import logoMini from '../../assets/images/logo-mini.svg';
import { connect } from 'react-redux';
import { DEFAULT_IMAGE } from '../../helpers/constants';

const imgSrcMainPath = `${process.env.REACT_APP_BACKEND_HOST}`;


const mapStateToProps = (state) => {
  return {
    username: state.profileReducer.username,
    userimg: state.profileReducer.userimg,
    sidebarData: state.sidebarReducer
  };
};

function reduceSidebar(sidebarData) {

  return sidebarData.reduce(function (o, cur) {

    // Get the index of the key-value pair.
    let occurs = o.reduce(function (n, item, i) {
      return (item.ParentMenuID === cur.ParentMenuID) ? i : n;
    }, -1);

    // If the name is found,
    if (occurs >= 0) {

      // append the current value to its list of values.
      o[occurs].MenuName = o[occurs].MenuName.concat(cur.MenuName);
      o[occurs].PagePath = o[occurs].PagePath.concat(cur.PagePath);

      // Otherwise,
    } else {

      // add the current item to o (but make sure the value is an array).
      let obj = {
        ParentMenuName: cur.ParentMenuName,
        PagePath: [cur.PagePath],
        MenuName: [cur.MenuName],
        ParentMenuID: cur.ParentMenuID
      };
      o = o.concat([obj]);
    }

    return o;
  }, [])
}

class Sidebar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isSidebarActive: false,
      sidebarData: reduceSidebar(props.sidebarData)
    };
    this.userImg = imgSrcMainPath + props.userimg;
  }


  async toggleMenuState(menuState) {

    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      this.setState({ isSidebarActive: false });

      this.setState({ [menuState]: true });
    }

  }

  componentDidUpdate(prevProps) {

    if (prevProps.sidebarData !== this.props.sidebarData) {
      this.setState({
        sidebarData: reduceSidebar(this.props.sidebarData)
      });

    }
  }

  componentDidMount() {

    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });


  }

  onRouteChanged() {

    document.querySelector('#sidebar').classList.remove('active');

    this.setState({ isSidebarActive: false });


    const dropdownPaths = [];

    for (let i = 0, n = this.state.sidebarData.length; i < n; i++) {
      let parentMenuName = this.state.sidebarData[i].ParentMenuName;
      let parentMenuID = this.state.sidebarData[i].ParentMenuID;

      let pathObj = {
        path: parentMenuName,
        state: `${parentMenuID}Open`
      }
      dropdownPaths.push(pathObj);
    }

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));

  }

  isPathActive(path) {

    let matchedSidebarData = this.state.sidebarData.find(o => o.ParentMenuName === path);

    if (matchedSidebarData !== undefined) {
      return (
        this.props.location.pathname === path) ||
        this.props.location.pathname.startsWith(path + "/") ||
        matchedSidebarData.PagePath.find((e) => this.props.location.pathname === e) ||

        // matches subpages. ex: "/users" matches "/users/form/1"
        matchedSidebarData.PagePath.find((e) => this.props.location.pathname.startsWith(e + "/"));
    }
    return this.props.location.pathname === path ||
      this.props.location.pathname.startsWith(path + "/")
  }


  //TODO: render Sidebar based on PageRoles of User, also add custom privilege for each User
  render() {

    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <Link className="sidebar-brand brand-logo" to="/home">
            <img src={logo} alt="logo" />
          </Link>
          <Link className="sidebar-brand brand-logo-mini" to="/home">
            <img src={logoMini} alt="logo" />
          </Link>

        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img className="img-xs rounded-circle " src={this.userImg} alt="profile" ref={img => this.img = img} onError={
                    () => this.img.src = `${imgSrcMainPath}${DEFAULT_IMAGE}`
                  } />
                  <span className="count bg-success"></span>
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal"><Trans>{this.props.username}</Trans></h5>
                  <span><Trans>Gold Member</Trans></span>
                </div>
              </div>
              <Dropdown alignRight>
                <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                  <i className="mdi mdi-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sidebar-dropdown preview-list">
                  <a href="!#" className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-primary"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Account settings</Trans></p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="!#" className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-onepassword  text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>Change Password</Trans></p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a href="!#" className="dropdown-item preview-item" onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-calendar-today text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small"><Trans>To-do list</Trans></p>
                    </div>
                  </a>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </li>

          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>Navigation</Trans></span>
          </li>

          {(this.state.sidebarData.length) && this.state.sidebarData.map(item =>
            // match parent menu to the current page location
            (item.ParentMenuID !== null)
              ? <li key={`parent${item.ParentMenuID}`} className={this.isPathActive(item.ParentMenuID) ? 'nav-item menu-items active' : 'nav-item menu-items'}>
                <div className={this.state[`${item.ParentMenuID}Open`] ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState(`${item.ParentMenuID}Open`)} data-toggle="collapse">
                  <span className="menu-icon">
                    <i className="mdi mdi-dashboard"></i>
                  </span>
                  <span className="menu-title text-wrap"><Trans>{item.ParentMenuName}</Trans></span>
                  <i className="menu-arrow"></i>
                </div>
                <Collapse in={!!this.state[`${item.ParentMenuID}Open`]}>
                  <div>
                    <ul className="nav flex-column sub-menu">

                      {item.MenuName.map((item2, key2) => {

                        // match child menu to the current page location
                        return <li key={`menu${item.PagePath[key2]}`} className="nav-item">
                          <Link className={this.isPathActive(`${item.PagePath[key2]}`) ? 'nav-link active' : 'nav-link'} to={`${item.PagePath[key2]}`}>
                            <Trans>{item2}</Trans></Link></li>
                      })}

                    </ul>
                  </div>
                </Collapse>
              </li>
              // if no ParentMenuID
              : item.MenuName.map((item2, key2) => {
                return <li key={`menu${item.PagePath[key2]}`} className={this.isPathActive(`${item.PagePath[key2]}`) ? 'nav-item menu-items active' : 'nav-item menu-items'}>
                  <Link className="nav-link" key={`link${item.PagePath[key2]}`} to={`${item.PagePath[key2]}`}>
                    <span className="menu-icon"><i className="mdi mdi-speedometer"></i></span>
                    <span className="menu-title"><Trans>{item2}</Trans></span>
                  </Link>
                </li>
              })

          )}


          {/* <li className={this.isPathActive('/basic-ui') ? 'nav-item menu-items active' : 'nav-item menu-items'}>

            <div className={this.state.basicUiMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('basicUiMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-laptop"></i>
              </span>
              <span className="menu-title"><Trans>Basic UI Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.basicUiMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/basic-ui/buttons') ? 'nav-link active' : 'nav-link'} to="/basic-ui/buttons"><Trans>Buttons</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/basic-ui/dropdowns') ? 'nav-link active' : 'nav-link'} to="/basic-ui/dropdowns"><Trans>Dropdowns</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/basic-ui/typography') ? 'nav-link active' : 'nav-link'} to="/basic-ui/typography"><Trans>Typography</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/form-elements') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.formElementsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('formElementsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-playlist-play"></i>
              </span>
              <span className="menu-title"><Trans>Form Elements</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.formElementsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/form-elements/basic-elements') ? 'nav-link active' : 'nav-link'} to="/form-elements/basic-elements"><Trans>Basic Elements</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/tables') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.tablesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('tablesMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title"><Trans>Tables</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.tablesMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/tables/basic-table') ? 'nav-link active' : 'nav-link'} to="/tables/basic-table"><Trans>Basic Table</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/charts') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.chartsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('chartsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-chart-bar"></i>
              </span>
              <span className="menu-title"><Trans>Charts</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.chartsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/charts/chart-js') ? 'nav-link active' : 'nav-link'} to="/charts/chart-js"><Trans>Chart Js</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/icons') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.iconsMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('iconsMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-contacts"></i>
              </span>
              <span className="menu-title"><Trans>Icons</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.iconsMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/icons/mdi') ? 'nav-link active' : 'nav-link'} to="/icons/mdi"><Trans>Material</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className={this.isPathActive('/user-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.userPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('userPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-security"></i>
              </span>
              <span className="menu-title"><Trans>User Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.userPagesMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/user-pages/login-1') ? 'nav-link active' : 'nav-link'} to="/user-pages/login-1"><Trans>Login</Trans></Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/user-pages/register-1') ? 'nav-link active' : 'nav-link'} to="/user-pages/register-1"><Trans>Register</Trans></Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link"><Trans>More</Trans></span>
          </li>
          <li className={this.isPathActive('/error-pages') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <div className={this.state.errorPagesMenuOpen ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('errorPagesMenuOpen')} data-toggle="collapse">
              <span className="menu-icon">
                <i className="mdi mdi-lock"></i>
              </span>
              <span className="menu-title"><Trans>Error Pages</Trans></span>
              <i className="menu-arrow"></i>
            </div>
            <Collapse in={this.state.errorPagesMenuOpen}>
              <div>
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item"> <Link className={this.isPathActive('/error-pages/error-404') ? 'nav-link active' : 'nav-link'} to="/error-pages/error-404">404</Link></li>
                  <li className="nav-item"> <Link className={this.isPathActive('/error-pages/error-500') ? 'nav-link active' : 'nav-link'} to="/error-pages/error-500">500</Link></li>
                </ul>
              </div>
            </Collapse>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" href="http://bootstrapdash.com/demo/corona-react-free/documentation/documentation.html" rel="noopener noreferrer" target="_blank">
              <span className="menu-icon">
                <i className="mdi mdi-file-document-box"></i>
              </span>
              <span className="menu-title"><Trans>Documentation</Trans></span>
            </a>
          </li> */}
        </ul>
      </nav>
    );
  }


}

export default connect(mapStateToProps)(withRouter(Sidebar));