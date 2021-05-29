import { AsyncStorage } from "react-native";

export const storage = {
    storeUserDetail: async (userData) => {
        await AsyncStorage.setItem('userid', JSON.stringify(userData.id));
        await AsyncStorage.setItem('role', userData.role);
        await AsyncStorage.setItem('name', JSON.stringify(userData.display_name));
        await AsyncStorage.setItem('token', userData.access_token);
        await AsyncStorage.setItem('email', userData.email);
        await AsyncStorage.setItem('first_visited', JSON.stringify(true));
        
    },
}