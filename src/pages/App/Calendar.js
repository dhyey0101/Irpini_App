import React, { Component } from 'react';
import { StatusBar, KeyboardAvoidingView, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarList, Calendar, LocaleConfig } from 'react-native-calendars';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { t } from '../../../locals';
import { schedule_list_by_category_idAction } from './../../util/Action';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const lang = i18n.locale = Localization.locale.substr(0, 2);

if(lang == 'it')
{
LocaleConfig.locales['it'] = {
    monthNames: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
    monthNamesShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
    dayNames: ['DOMENICA','LUNEDI','MARTEDÌ','MERCOLEDÌ','GIOVEDI','VENERDÌ','SABATO'],
    dayNamesShort: ['DOM','LUN','MAR','MER','GIO','VEN','SAB']
  };
  LocaleConfig.defaultLocale = 'it';
}else{
  LocaleConfig.locales['en'] = {
    monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    monthNamesShort: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    dayNames: ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],
    dayNamesShort: ['SUN.','MON.','TUE.','WED.','THUR.','FRI.','SAT.']
  };
  
  LocaleConfig.defaultLocale = 'en';
}

export default class CalendarScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            selectedDate: [],
            canceledDate:[]


        }
    }
    
    componentDidMount() {
        const { navigation } = this.props;

        const selectedCategoryName = this.props.navigation.getParam("selectedCategoryName");
        this.setState({ selectedCategoryName : selectedCategoryName})
        this.CalendarInfo();

        this.focusListener = navigation.addListener("didFocus", () => {
            this.setState({ loader: true })
            this.CalendarInfo();
        });
    }

    async componentWillUnmount() {
        this.focusListener.remove();
    }

    async CalendarInfo() {
        this.setState({ loader: true })
        let customer_id = await AsyncStorage.getItem('userid');
        const category_id = this.props.navigation.getParam("garbage_category_id");
        let Token = await AsyncStorage.getItem('token');
        const calenderData = {
            current_user_id: customer_id,
            category_id: category_id,
            access_token: Token,
        }
        // console.log(calenderData)
        var response = schedule_list_by_category_idAction(calenderData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    selectedDate: responseJson.result,
                    canceledDate: responseJson.cancel_schedule,
                    loader: false
                });
                
            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    render() {
        const { navigate } = this.props.navigation;
        const { selectedDate, canceledDate, selectedCategoryName, loader } = this.state;


        var votes = {};

        selectedDate.forEach((selectedDate, key) => {
            var productID = selectedDate;
            votes[productID] = {
                selected: true, selectedColor: '#65be44'
            }
        });
        canceledDate.forEach((canceledDate, key) => {
            var productID = canceledDate.cancle_date;
            votes[productID] = {
                selected: true, selectedColor: '#c2272d'
            }
        });

        canceledDate.forEach((canceledDate, key) => {
            var productID = canceledDate.new_schedule_date;
            votes[productID] = {
                selected: true, selectedColor: 'white',
                customStyles: {
                    container: {
                      borderColor: '#65be44',
                      borderWidth: 2
                    },
                    text: {
                      color: '#000'
                    }
                  }
            }
        });

        if (!loader) {
        return (
            <View style={styles.container}>
                {/* <Text style={{ textAlign: 'center'}}>Comingsoon..</Text> */}
                {/* <Row style={styles.NavBar}>
                    <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                    <Row style={styles.slide2Logo}>
                        <TouchableOpacity style={{ alignItems: 'center', padding: 10, width: 50, }} onPress={() => navigate("CategoryList")}>
                            <Col style={{ justifyContent: 'center' }}>
                                <Back_Arrow width={15} height={15} />
                            </Col>
                        </TouchableOpacity>
                        <Col>
                            <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{selectedCategoryName} {t("Calendar")}</Text>
                        </Col>
                    </Row>
                </Row> */}
                <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("CategoryList")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{selectedCategoryName} {t("Calendar")}</Text>
                            </View>
                        </View>
                    </Row>
                <CalendarList
                    style={{
                        borderBottomWidth: 1,
                        borderColor: '#d4d4d4',

                    }}
                    // // Callback which gets executed when visible months change in scroll view. Default = undefined
                    // onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
                    // // Max amount of months allowed to scroll to the past. Default = 50
                    // pastScrollRange={50}
                    // // Max amount of months allowed to scroll to the future. Default = 50
                    // futureScrollRange={50}
                    // // Enable or disable scrolling of calendar list
                    // scrollEnabled={true}
                    // // Enable or disable vertical scroll indicator. Default = false
                    // showScrollIndicator={true}
                    // selected={'2021-03-16'}
                    // style={{ color: 'red' }}

                    // eventDates={selectedDate}
                    markedDates={
                        votes
                    }
                    // customStyle={customStyle}
                    markingType={'custom'}
                    date={this.state.date}
                    // minDate={new Date()}
                    // onDayPress={this.canceledDate() }
                    // markedDates={mark}
                    theme={{
                        textSectionTitleColor: '#62bb46',
                            textSectionTitleDisabledColor: '#102b46',
                            selectedDayTextColor: '#fff',
                            todayTextColor: '#00adf5',
                            dayTextColor: '#d4d4d4',
                            textDisabledColor: '#fff',
                            dotColor: '#00adf5',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#102b46',
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: '#62bb46',
                            indicatorColor: '#102b46',
                            textDayFontFamily: 'Roboto-Bold',
                            // textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'Roboto-Bold',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 25,
                            textDayHeaderFontSize: 16
                    }}


                />
            </View>
        )
    } else {
        return (
            <ActivityIndicator
                style={styles.loading}
                size="large"
                color="#65be44"
            />
        );
    }
    }
}
const sWidth = Dimensions.get('window').width;
const sHeight = Dimensions.get('window').height;
const ratio = sWidth / sHeight; //sWidth = ratio * sHeight
const styles = StyleSheet.create({
    headerContainer: {
        ...Platform.select({
            ios: {
                width: sWidth,
                // height: 90,
                height: '17%',
            },
            android: {
                width: sWidth,
                // height: 90,
                height: '12%',
            }
        })
    },
    top_background: {
        ...Platform.select({
            ios: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.87,
                paddingTop: sHeight * 1.7,
            },
            android: {
                width: sHeight * 2,
                height: sHeight * 2,
                borderRadius: sHeight * 1,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                backgroundColor: '#6DBF43',
                alignItems: 'center',
                marginLeft: ((ratio * sHeight) * 0.5) - (sHeight),
                marginTop: -sHeight * 1.90,
                paddingTop: sHeight * 1.7,
            }
        })


    },
    top_content: {
        paddingTop: sHeight * 0.02,
        width: sWidth,
        height: sHeight * 0.3,
        alignItems: 'center',
    },
    headerLogo: {
        marginTop: sHeight * 0.15,
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        ...Platform.select({
            ios: {
                marginTop: sHeight * 0.22,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            },
            android: {
                marginTop: sHeight * 0.21,
                color: "#fff",
                fontSize: 17,
                fontFamily: 'Roboto-Bold',
            }
        })
    },
    headerBackArrow: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: sHeight * 0.215,
                left: '10%',
                padding: 20,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.21,
                left: '10%',
                padding: 20
            }
        })
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // textAlignVertical: 'center',
        backgroundColor:'#fff'
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 45,
                width: '100%',
                alignItems: 'center',
                marginLeft: 50
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 40,
                height: 50,
                width: '100%',
                marginLeft: 50
            }
        })
    },
    NavBar: {
        ...Platform.select({
            ios: {
                marginTop: 60,
                height: 102
            },
            android: {
                marginTop: 30,
                height: 102
            }
        })
    },
    loading: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },

})