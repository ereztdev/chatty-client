# Websockets => React Hooks!
![alt text](https://image.prntscr.com/image/wfbPtUg7RC6XKxr8l8zByQ.png "Description")

### This app will implement the 16.8 shift to 'hooks', as much as possible.
* this has a [complementary server project](https://github.com/ereztdev/ChatRooms-node) that acts as the ws endpoint.
* `useEffect()` is a powerful tool, I recommend to read [this article](https://daveceddia.com/useeffect-hook-examples/) that goes
into descriptive depth (gifs!) to explain how it works.
* implementations still needed for production:
  - __Security:__ 
    - password/membership
    - tokenization for endpoints
    - serverside .env with key (salt)
  - __Logic__
    - Hash userID for high traffic uniqueness
    - 2DBs needed: NoSQL DB needed for chat + SQL for user/admin mgmt.
  - __Code__
    - wrap up as a npm @package
