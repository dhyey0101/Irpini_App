import React, { Component } from "react";
import {
    Image,
    Platform,
    Dimensions,
    View,
    Text,
    StyleSheet,
    StatusBar,
    ActivityIndicator
} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "./../../images/logo.svg";
import { t } from "../../../locals";

export default class SuccessPageRequestForm extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerShown: false,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
        };
    }
    // async UNSAFE_componentWillMount() {
    async componentDidMount() {
        setTimeout(() => {
            this.props.navigation.navigate("AllComplainList");
        }, 5000);
    }

    render() {
        const { loader } = this.state;
        if (!loader) {
            return (
                <View style={{ flex: 1 }}>
                    <StatusBar />
                    <LinearGradient
                        colors={["rgba(140,198,63,0.8)", "rgba(57, 181, 74,0.8)"]}
                        style={{ flex: 1 }}
                    >
                        <Row style={styles.LogoRow}>
                            <Col style={styles.LogoCol}>
                                <Logo width={220} height={220} />
                            </Col>
                        </Row>
                        <Row style={styles.BinRow}>
                            <Image
                                source={require("../../images/Smile.png")}
                                style={styles.TruckImage}
                            />
                        </Row>

                        <Row style={{ marginHorizontal: 30 }}>
                            <Col style={styles.WelcomeRow}>
                                <Text style={styles.textSlide1}>
                                    {t("Closed reporting")}
                                </Text>
                                <Text style={styles.descriptionText}>
                                    {t("It is about to redirected to My Recommendations")}
                                </Text>
                            </Col>
                        </Row>


                    </LinearGradient>
                </View>
            );
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
const styles = StyleSheet.create({
    LogoRow: {
        height: 50,
        marginTop: "30%",
    },

    LogoCol: {
        justifyContent: "center",
        alignItems: "center",
        height: 30,
    },
    BinRow: {
        justifyContent: "center",
        marginTop: "10%",
    },
    TruckImage: {
        width: 210,
        height: 210,
    },
    WelcomeRow: {
        ...Platform.select({
            ios: {
                justifyContent: "center",
                alignItems: "center",
                // height: 50,
                // marginTop: "10%",
            },
            android: {
                justifyContent: "center",
                alignItems: "center",
                // height: 30,
            },
        }),
    },
    textSlide1: {
        color: "#fff",
        fontSize: 28,
        fontFamily: "Roboto-Bold",
        textAlign: 'center',
    },

    descriptionText: {
        marginTop: 20,
        color: "#fff",
        fontSize: 28,
        fontFamily: "Roboto-Medium",
        textAlign: 'center',
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
});
