import { Appearance } from 'react-native';

interface Colors {
    [key: string]: string | undefined
}

// COLORS FOR THE DARK THEME
const darkColorScheme: Colors = {
    text: '#ffffff',
    lightText: 'gray',
    btnColor: '#559FD6',
    mapCircleBg: 'rgba(85, 159, 214, 0.2)',
    drawerBg: '#03205B',
    shadow: '#000000',
    modelDark: 'rgba(0, 0, 0, 0.5)',
    homeBg: '#051638',
    sidebarBg: '#F8F8F8',
    borderColor: 'gray',
    sidebarLastOption: '#FF0000',
    lightGray: '#CECECE',
    imageUpload: '#20272C',
    inputSearch: '#F5F5F5',
};

// COLORS FOR THE LIGHT THEME
const lightColorScheme: Colors = {
    text: '#ffffff',
    lightText: 'gray',
    btnColor: '#559FD6',
    mapCircleBg: 'rgba(85, 159, 214, 0.2)',
    drawerBg: '#03205B',
    shadow: '#000000',
    modelDark: 'rgba(0, 0, 0, 0.5)',
    homeBg: '#051638',
    sidebarBg: '#F8F8F8',
    borderColor: 'gray',
    sidebarLastOption: '#FF0000',
    lightGray: '#CECECE',
    imageUpload: '#20272C',
    inputSearch: '#F5F5F5',
};

export const Color = (color: string) => {
    // GET USER DEVICE THEME (LIGHT/DARK)
    const colorScheme = Appearance.getColorScheme();

    if (colorScheme === 'dark') {           // IF USER DEVICE THEME IS DARK
        return darkColorScheme[color];
    }else {                                 // IF USER DEVICE THEME IS LIGHT
        return lightColorScheme[color];
    }
};
