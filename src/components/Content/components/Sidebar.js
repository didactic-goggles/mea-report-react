import React from 'react'
import {NavLink} from "react-router-dom";



export default function Sidebar() {
    console.log('Rendering => Sidebar');
    return (
        <div class="app-sidebar sidebar-shadow">
            <div class="app-header__logo">
                <div class="logo-src"></div>
                <div class="header__pane ml-auto">
                    <div>
                        <button type="button" class="hamburger close-sidebar-btn hamburger--elastic"
                            data-class="closed-sidebar">
                            <span class="hamburger-box">
                                <span class="hamburger-inner"></span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="app-header__mobile-menu">
                <div>
                    <button type="button" class="hamburger hamburger--elastic mobile-toggle-nav">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="app-header__menu">
                <span>
                    <button type="button"
                        class="btn-icon btn-icon-only btn btn-primary btn-sm mobile-toggle-header-nav">
                        <span class="btn-icon-wrapper">
                            <i class="fa fa-ellipsis-v fa-w-6"></i>
                        </span>
                    </button>
                </span>
            </div>
            <div class="scrollbar-sidebar">
                <div class="app-sidebar__inner">
                    <ul class="vertical-nav-menu">
                        <li class="app-sidebar__heading">Anasayfa</li>
                            <li>
                                <NavLink to="/" exact activeClassName="mm-active">
                                    <i class="metismenu-icon pe-7s-rocket"></i>
                                    Dashboard</NavLink>
                               
                            </li>
                            <li class="app-sidebar__heading">Kullanıcılar</li>
                            <li>
                            <NavLink to="/users" activeClassName="mm-active">
                            <i class="metismenu-icon pe-7s-display2"></i>
                                    Kullanıcı Detayları</NavLink>
                            </li>
                            <li class="app-sidebar__heading">Ödemeler</li>
                            <li>
                            <NavLink to="/payments" activeClassName="mm-active">
                            <i class="metismenu-icon pe-7s-display2"></i>
                                    Ödeme Detayları</NavLink>
                            </li>
                            {/* <li class="app-sidebar__heading">Servisler</li>
                            <li>
                                <a href="serviceDetails.html">
                                    <i class="metismenu-icon pe-7s-display2"></i>
                                    Servis Detayları
                                </a>
                            </li> */}
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
