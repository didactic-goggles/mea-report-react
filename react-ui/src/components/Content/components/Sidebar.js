import React from 'react'
import {NavLink} from "react-router-dom";
import {FaHome, FaUserFriends} from 'react-icons/fa';
import {MdPayment, MdShare} from 'react-icons/md';
import {AiOutlineCloudUpload} from 'react-icons/ai';
import {GiFiles} from 'react-icons/gi';
export default function Sidebar() {
    console.log('Rendering => Sidebar');
    return (
        <div className="app-sidebar sidebar-shadow">
            <div className="app-header__logo">
                <div className="logo-src"></div>
                <div className="header__pane ml-auto">
                    <div>
                        <button type="button" className="hamburger close-sidebar-btn hamburger--elastic"
                            data-class="closed-sidebar">
                            <span className="hamburger-box">
                                <span className="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="app-header__mobile-menu">
                <div>
                    <button type="button" className="hamburger hamburger--elastic mobile-toggle-nav">
                        <span className="hamburger-box">
                            <span className="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div className="app-header__menu">
                <span>
                    <button type="button"
                        className="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span className="btn-icon-wrapper">
                            <i className="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>
            <div className="scrollbar-sidebar">
                <div className="app-sidebar__inner">
                    <ul className="vertical-nav-menu">
                            {/* <li className="app-sidebar__heading">Anasayfa</li> */}
                            <li>
                                <NavLink to="/" exact activeClassName="mm-active">
                                    <FaHome />
                                    Anasayfa</NavLink>
                               
                            </li>
                            <li className="app-sidebar__heading">Kullanıcılar</li>
                            <li>
                            <NavLink to="/users" activeClassName="mm-active">
                                <FaUserFriends />
                                    Kullanıcı Detayları</NavLink>
                            </li>
                            <li className="app-sidebar__heading">Ödemeler</li>
                            <li>
                            <NavLink to="/payments" activeClassName="mm-active">
                                <MdPayment />
                                    Ödeme Detayları</NavLink>
                            </li>
                            <li class="app-sidebar__heading">Servisler</li>
                            <li>
                                <NavLink to="/services" activeClassName="mm-active">
                                    <MdShare />
                                    Servis Detayları
                                </NavLink>
                            </li>
                            <li class="app-sidebar__heading">Sistem</li>
                            <li>
                                <NavLink to="/upload" activeClassName="mm-active">
                                    <AiOutlineCloudUpload />
                                    Dosya Yükle
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/upload-list" activeClassName="mm-active">
                                    <GiFiles />
                                    Dosya Geçmişi
                                </NavLink>
                            </li>
                    </ul>
                </div>
            </div>
        </div>
    );
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>

//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. */}
//         <Switch>
//           <Route path="/users">
//             <Users />
//           </Route>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   );
}
