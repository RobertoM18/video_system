import{d as i,j as e,H as a,L as n}from"./app-BS13SVDj.js";/* empty css            */function t(){const{auth:r}=i().props;return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Bienvenido",children:e.jsx("style",{children:`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: "Arial", sans-serif;
                        color: #fff;
                        background: url("/background-home.jpg") no-repeat center center/cover;
                        display: flex;
                        flex-direction: column;
                        min-height: 100vh;
                    }
                    .background-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        background: rgba(0, 0, 0, 0.75);
                        z-index: 0;
                    }
                    header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 20px 50px;
                        position: relative;
                        z-index: 1;
                    }
                    .logo {
                        font-size: 28px;
                        font-weight: bold;
                        color: #fcfcfc;
                    }
                    nav a.btn-nav {
                        background: #ffd700;
                        color: #000;
                        padding: 8px 16px;
                        border-radius: 5px;
                        margin-left: 20px;
                        text-decoration: none;
                        font-size: 16px;
                        transition: background 0.3s;
                    }
                    nav a.btn-nav:hover {
                        background: #e6c200;
                    }
                    main {
                        text-align: center;
                        padding: 150px 30px;
                        position: relative;
                        z-index: 1;
                        flex: 1;
                    }
                    main h1 {
                        font-size: 48px;
                        margin-bottom: 20px;
                    }
                    main p {
                        font-size: 20px;
                        margin-bottom: 40px;
                    }
                    footer {
                        text-align: center;
                        padding: 20px;
                    }
                    `})}),e.jsx("div",{className:"background-overlay"}),e.jsxs("header",{children:[e.jsx("div",{className:"logo",children:"CineVerse"}),e.jsxs("nav",{children:[e.jsx(n,{href:route("login"),className:"btn-nav",children:"Iniciar Sesión"}),e.jsx(n,{href:route("register"),className:"btn-nav",children:"Registrarse"})]})]}),e.jsxs("main",{children:[e.jsx("h1",{children:"Bienvenidos a CineVerse"}),e.jsx("h2",{children:"Mejores peliculas y series para ver en cualquier lugar."}),e.jsx("h3",{children:"Explora una amplia selección de películas y series de todos los géneros. Disfruta de contenido exclusivo y mantente al día con las últimas novedades del mundo del cine y la telev"})]}),e.jsx("footer",{children:e.jsx("p",{children:"© 2025 CineVerse"})})]})}export{t as default};
