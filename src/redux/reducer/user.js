import {createSlice} from '@reduxjs/toolkit';
import { App_Primary_color } from '../../common/Colors/colors';

export const userSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {},
    login: false,
    isFreeAccess: true,
    isFirstTime: true,
    skip: false,
    statusBarBGColor: App_Primary_color,
    accountType: 'User', // 'User' | 'Seller'
  },
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      return {...state, userData: user, login: true, accountType: 'User'};
    },
    setSeller(state, action) {
      const seller = action.payload;
      return {...state, userData: seller, login: true, accountType: 'Seller'};
    },
    removeUser(state, action) {
      return {...state, userData: {}, login: false, accountType: 'User'};
    },
    setIsFirstTime(state, action) {
      return {...state, isFirstTime: action.payload};
    },
    setSkip(state, action) {
      return {...state, skip: action.payload};
    },
    setStatusBarColor(state, action) {
      return { ...state, statusBarBGColor: action.payload };
    }
  },
});

export const {setUser, setSeller, removeUser, setIsFirstTime, setSkip, setStatusBarColor} = userSlice.actions;

export default userSlice.reducer;
