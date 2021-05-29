import React, { Component } from 'react';
import { Animated, Dimensions, StatusBar, ActivityIndicator, AsyncStorage, StyleSheet, View, Image, Text, TouchableOpacity, Modal, Platform, FlatList, ScrollView } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarList, Calendar, LocaleConfig } from 'react-native-calendars';
import Back_Arrow from './../../images/Back_Arrow.svg';
import { t } from '../../../locals';
import { user_all_schedule_listAction } from './../../util/Action';
import BottomSheet from 'reanimated-bottom-sheet';
import { concat } from 'react-native-reanimated';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
// import { ScrollView } from 'react-native-gesture-handler';

const lang = i18n.locale = Localization.locale.substr(0, 2);

const { width, height } = Dimensions.get('window');

if (lang == 'it') {
    LocaleConfig.locales['it'] = {
        monthNames: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthNamesShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        dayNames: ['DOMENICA', 'LUNEDI', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDI', 'VENERDÌ', 'SABATO'],
        dayNamesShort: ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB']
    };
    LocaleConfig.defaultLocale = 'it';
} else {
    LocaleConfig.locales['en'] = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
        dayNamesShort: ['SUN.', 'MON.', 'TUE.', 'WED.', 'THUR.', 'FRI.', 'SAT.']
    };

    LocaleConfig.defaultLocale = 'en';
}

export default class GeneralCalendarScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false
        };
    };
    constructor(props) {
        super(props);
        this.sheetRef = React.createRef(null);
        this.state = {
            selectedDate: '',
            date: '',
            cartaDate: [],
            indifferenziatoDate: [],
            multimaterialeDate: [],
            organicoDate: [],
            vetroDate: [],
            description: '',
            opacity: new Animated.Value(0),
            isOpen: false,

        }
    }

    componentDidMount() {
        const { navigation } = this.props;
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
        let customer_id = await AsyncStorage.getItem('userid');
        let Token = await AsyncStorage.getItem('token');
        const calenderData = {
            current_user_id: customer_id,
            access_token: Token,
        }
        // console.log(calenderData);
        this.setState({ loader: true })
        var response = user_all_schedule_listAction(calenderData).then(function (responseJson) {
            // console.log(responseJson)
            if (responseJson.status == 1) {
                this.setState({
                    cartaDate: responseJson.result.carta,
                    indifferenziatoDate: responseJson.result.indifferenziato,
                    multimaterialeDate: responseJson.result.multimateriale,
                    organicoDate: responseJson.result.organico,
                    vetroDate: responseJson.result.vetro,
                    description: responseJson.description,
                    // description: responseJson.description,
                    loader: false
                });
                // console.log(responseJson.result.multimateriale)

            } else {
                this.setState({ loader: false });
                // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
            }
        }.bind(this));
    }

    selectDate(date) {

        var selectedDate = date.dateString
        this.setState({ selectedDate: selectedDate })
        // console.log(date.dateString);
        // console.log(this.state.description);
        var des = this.state.description[date.dateString];
        this.setState({ datedescription: des })

        if (des == undefined) {
            this.onClose()
        } else {
            this.onOpen()
        }
    }

    onClose = () => {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
        }).start();
        this.sheetRef.current.snapTo(0);
        setTimeout(() => {
            this.setState({ isOpen: false });
        }, 50);
    };

    onOpen = () => {
        const { description } = this.state;
        this.setState({ isOpen: true });
        this.sheetRef.current.snapTo(2);
        Animated.timing(this.state.opacity, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true,
        }).start();

    };

    renderBackDrop = () => (
        <Animated.View
            style={{
                opacity: this.state.opacity,
                backgroundColor: '#000',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
            <TouchableOpacity
                style={{
                    width: width,
                    height: height,
                    backgroundColor: 'transparent',
                }}
                activeOpacity={1}
                onPress={this.onClose()}
            />
        </Animated.View>
    );

    renderContent = ({ item }) => {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    height: 450,
                }}
            >
                <Col style={{ marginLeft: 30, marginRight: 30, marginTop: 10 }}>
                    <Row style={{ width: "70%", height: 40 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Medium', color: '#62bb46' }}>
                            {selectedDate}
                        </Text>
                    </Row>
                    <Row style={{ marginTop: 10, height: 25 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Bold', color: '#666666' }}>{item.category}</Text>
                    </Row>

                    <Row style={{ marginTop: 10, height: 50, }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Roboto-Light', color: '#666666' }}>{item.address}</Text>
                    </Row>
                </Col>
            </View>
        )

    };

    renderFlatList = () => {
        const { datedescription, selectedDate } = this.state;

        if (datedescription != undefined) {
            return (
                <View
                    style={{
                        backgroundColor: '#fff',
                        height: 450,
                    }}
                >
                    <Row style={{ height: 40, marginLeft: 30, alignItems: 'center' }}>
                        <Col>
                            <Text style={{ fontSize: 20, fontFamily: 'Roboto-Medium', color: '#62bb46' }}>
                                {selectedDate}
                            </Text>
                        </Col>
                        <Col style={{ justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 20, width: '20%' }}>
                            <TouchableOpacity onPress={() => this.sheetRef.current.snapTo(0)}>
                                <Image
                                    source={require("../../images/Cross-Green.png")}
                                    style={{ width: 30, height: 30 }} />
                            </TouchableOpacity>
                        </Col>
                    </Row>
                    <ScrollView>
                    <FlatList
                        onEndReachedThreshold={200}
                        style={{height:200}}
                        data={datedescription}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                }}
                            >
                                <Col style={{ marginLeft: 30, marginRight: 30 }}>

                                    <Row style={{ marginTop: 10, height: 25 }}>
                                        <Text style={{ fontSize: 20, fontFamily: 'Roboto-Bold', color: '#666666' }}>{item.category}</Text>
                                    </Row>

                                    <Row style={{ marginTop: 10, height: 50, }}>
                                        <Text style={{ fontSize: 15, fontFamily: 'Roboto-Light', color: '#666666' }}>{item.address}</Text>
                                    </Row>
                                </Col>
                            </View>
                        )}

                    />
                    </ScrollView>
                </View>
            )
        }

    };


    render() {
        const { navigate } = this.props.navigation;
        const { cartaDate, indifferenziatoDate, multimaterialeDate, organicoDate, vetroDate, loader, description } = this.state;

        var votes = {};
        if (cartaDate) {
            cartaDate.forEach((cartaDate, key) => {
                var Date = cartaDate.date;

                if (description[Date]) {
                    if (description[Date].length > 1) {
                        votes[Date] = {
                            selected: true, selectedColor: "#6ABE44"
                        }
                    } else {
                        votes[Date] = {
                            selected: true, selectedColor: "#eeeae9"
                        }
                    }
                }
            });
        }

        if (indifferenziatoDate) {
            indifferenziatoDate.forEach((indifferenziatoDate, key) => {
                var Date = indifferenziatoDate.date;

                if (description[Date]) {
                    if (description[Date].length > 1) {
                        votes[Date] = {
                            selected: true, selectedColor: "#6ABE44"
                        }
                    } else {
                        votes[Date] = {
                            selected: true, selectedColor: '#d7d7d9'
                        }
                    }
                }

            });
        }

        if (multimaterialeDate) {
            multimaterialeDate.forEach((multimaterialeDate, key) => {
                var Date = multimaterialeDate.date;
                if (description[Date]) {
                    if (description[Date].length > 1) {
                        votes[Date] = {
                            selected: true, selectedColor: "#6ABE44"
                        }
                    } else {
                        votes[Date] = {
                            selected: true, selectedColor: '#C6D0E9'
                        }
                    }
                }
            });
        }

        if (organicoDate) {
            organicoDate.forEach((organicoDate, key) => {
                var Date = organicoDate.date;
                if (description[Date]) {
                    if (description[Date].length > 1) {
                        votes[Date] = {
                            selected: true, selectedColor: "#6ABE44"
                        }
                    } else {
                        votes[Date] = {
                            selected: true, selectedColor: '#d2c2b3'
                        }
                    }
                }
            });
        }
        
        if (vetroDate) {
            vetroDate.forEach((vetroDate, key) => {
                var Date = vetroDate.date;
                if (description[Date]) {
                    if (description[Date].length > 1) {
                        votes[Date] = {
                            selected: true, selectedColor: "#6ABE44"
                        }
                    } else {
                        votes[Date] = {
                            selected: true, selectedColor: '#ffe7c5'
                        }
                    }
                }
            });
        }
        // console.log(description);
        // description.forEach((row, key) => {
        // var Date = vetroDate.date;
        // votes[Date] = {
        //     selected: true, selectedColor: '#ffe7c5'
        // }

        // });

        if (!loader) {
            return (
                <View style={styles.container}>
                    {/* <Text style={{ textAlign: 'center'}}>Comingsoon..</Text> */}
                    {/* <Row style={styles.NavBar}>
                        <Image source={require('../../images/Header-Curv-Shape.png')} style={{ width: "100%", height: 100 }} />
                        <Row style={styles.slide2Logo}>
                            <TouchableOpacity style={{ alignItems: 'flex-end', paddingVertical: 20, width: 80 }} onPress={() => navigate("CategoryList")}>
                            <Col style={{ justifyContent: 'center' }}>
                                    <Back_Arrow width={15} height={15} />
                                </Col>
                            </TouchableOpacity>
                            <Col style={styles.header}>
                                <Text style={{ color: "#fff", fontSize: 17, fontFamily: 'Roboto-Bold' }}>{t("Calendar")}</Text>
                            </Col>
                        </Row>
                    </Row> */}
                    <Row style={styles.headerContainer}>
                        <View style={styles.top_background}>
                            <View style={styles.top_content}>
                                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("Waste")}>
                                    <Col style={{ justifyContent: 'center' }}>
                                        <Back_Arrow width={15} height={15} />
                                    </Col>
                                </TouchableOpacity>
                                <Text style={styles.headerText}>{t("Calendar")}</Text>
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
                        // date={this.state.date}
                        // minDate={new Date()}
                        onDayPress={(date) => this.selectDate(date)}
                        dateFormat='DD-MM-YYYY'
                        // markedDates={mark}
                        theme={{
                            textSectionTitleColor: '#62bb46',
                            textSectionTitleDisabledColor: '#102b46',
                            selectedDayTextColor: '#000',
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

                    <BottomSheet
                        ref={this.sheetRef}
                        // snapPoints={[0, 240, 0]}
                        // borderRadius={10}
                        enabledContentGestureInteraction={false}
                        renderContent={this.renderFlatList}

                        snapPoints={[
                            '-10%',
                            height * 0.5,
                            height * 0.35,
                            height * 0.85,
                        ]}
                        initialSnap={0}
                        //   renderHeader={this.renderHeader}
                        //   renderContent={this.renderInner}
                        onCloseEnd={this.onClose}

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
                left: '18%',
                padding: 20,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                marginTop: sHeight * 0.21,
                left: '18%',
                padding: 20
            }
        })
    },
    container: {
        flex: 1,
        // justifyContent: 'center',
        // textAlignVertical: 'center',
        backgroundColor: '#fff'
    },
    slide2Logo: {
        ...Platform.select({
            ios: {
                position: 'absolute',
                marginTop: 30,
                alignSelf: 'center',
                width: '100%',
                alignItems: 'center',
                // marginLeft: 50,
                // backgroundColor:'red'
            },
            android: {
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                height: 50,
                width: '100%',
                // marginLeft: 50,
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
    header: {
        ...Platform.select({
            ios: {
                marginLeft: width / 100 * 12,
            },
            android: {
                marginLeft: width / 100 * 15,
            }
        })

    }
})