# vvvshop
This is project in school. You can freely clone and use it
**Project Link** - ***http://vvvshopadmin.herokuapp.com/***

**Admin features**

- Login & Logout
- CRUD:
- Product management
- Blog management
- Supplier management
- Category management
- Order management
- User management
- Print data table as pdf

## API:

- [GOOGLEAPI_CLIENT_ID](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid/)
- [GOOGLEAPI_CLIENT_SECRET](https://developers.google.com/api-client-library/dotnet/guide/aaa_client_secrets/)
- [GOOGLEAPI_REDIRECT_URI](https://developers.google.com/identity/protocols/oauth2/native-app/)
- [GOOGLEAPI_REFRESS_TOKEN](https://developers.google.com/google-ads/api/docs/first-call/refresh-token/)


## Tech Stack 💻

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [AdminLTE](https://github.com/ColorlibHQ/AdminLTE)
- [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [Handlebars](https://handlebarsjs.com/)

## Installation:

**1. Clone this repo by running the following command :**

```bash
 git clone https://github.com/ngtsnn/vvvshop.git
 cd vvvshop
```

**2. Now install all the required packages(frontend & backend) by running the following commands :**

```
npm install
```

**3. Create a .env file in env folder of src folder and add the following** !important to use Google APIs

```
DB_CONNECT_STRING= your DB connect string
PORT= your port
SECRET_KEY= your secret key
RESET_KEY= your reset key
USER_BASE_URL=http://localhost:port/
GOOGLEAPI_CLIENT_ID= your google api client ID
GOOGLEAPI_CLIENT_SECRET= your google api client secret
GOOGLEAPI_REDIRECT_URI= your google api redirect uri

```


**4. Now start the react and node server by running the following command :-**

```
#Start the server
npm run dev

```

**5.** **🎉 Open your browser and go to `http://127.0.0.1:8080`**
