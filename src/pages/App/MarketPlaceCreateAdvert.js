import React, { Component } from "react";
import {
  RefreshControl,
  StatusBar,
  KeyboardAvoidingView,
  AsyncStorage,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from "react-native";
import { Col, Row } from "react-native-easy-grid";
import { LinearGradient } from "expo-linear-gradient";
import { saveAdvertProductData } from "./../../util/Action";
import Back_Arrow from "./../../images/Back_Arrow.svg";
import { t } from "../../../locals";
import { SliderBox } from "react-native-image-slider-box";
import TextInputMaterial from "react-native-material-textinput";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native-gesture-handler";
import * as ImageManipulator from 'expo-image-manipulator';
import DropdownAlert from 'react-native-dropdownalert';
import * as Permissions from "expo-permissions";
import validate from 'validate.js';
import HTML from "react-native-render-html";

const { width, height } = Dimensions.get("window");

export default class MarketPlaceCreateAdvert extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerShown: false,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      //   productImages: [],
      productImages: [],
      //   productImagesForDisplay: [],
      productImagesForDisplay: [],
      category_id: "",
      sub_category_id: "",
      title: "",
      mobile: "",
      description: "",
      phone_code: "+39",
      test: [],
      // termAndCondition: '',
      // modalVisible: true,

    };
    // this.getPermissionAsync();
  }

  componentDidMount() {
    this.getPermissionAsync();
    const sub_category_id = this.props.navigation.getParam("sub_category_id");
    const category_id = this.props.navigation.getParam("category_id");
    this.setState({
      category_id: category_id,
      sub_category_id: sub_category_id,
    });
    // this.termAndCondition();
  }

  async getPermissionAsync() {
    // Camera roll Permission
    if (Platform.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status !== "granted") {
        alert(t("Sorry, we need camera roll permission to make this work"));
      }
    }
    // Camera Permission
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  // termAndCondition() {
  //   this.setState({loader:true})
  //   get_term_condition_market_placeAction().then(function (responseJson) {
  //     // console.log(responseJson); 
  //     if (responseJson.status == 1) {
  //       this.setState({
  //         termAndCondition: responseJson.result.term_condtion_market_place,
  //         loader:false
  //       });
  //     } else {
  //       this.setState({ loader: false });
  //       // this.refs.defaultToastBottomWithDifferentColor.ShowToastFunction(responseJson.message);
  //     }
  //   }.bind(this));
  // }

    async saveData() {
      var constraints = {

      title: {
        presence: {
          allowEmpty: false,
          message: "^" + t("Title is required")
        }

      },
      description: {
        presence: {
          allowEmpty: false,
          message: "^" + t("Description is required")
        }

      },
        mobile: {
            presence: {
                allowEmpty: false,
                message: "^" + t("Mobile number is required")
            }
          //   ,
          //   format: {
          //     pattern: "[0-9]{8-15}",
          //     flags: "i",
          //     message: "^" + t("Please enter only number")
          // }

      }
    };
    const result = validate({ title: this.state.title, description: this.state.description, mobile: this.state.mobile }, constraints);
    if (result) {

      if (result.title) {
        this.dropdown.alertWithType('error', t('Error'), (result.title));
        return false;
      }
      if (result.description) {
        this.dropdown.alertWithType('error', t('Error'), (result.description));
        return false;
      }
      if (result.mobile) {
        this.dropdown.alertWithType('error', t('Error'), (result.mobile));
        return false;
      }

    }

      if(isNaN(this.state.mobile)) {
        this.dropdown.alertWithType('error', t('Error'), t('Please enter only number'));
        return false;
      }
      this.setState({ loader: true });
      let customer_id = await AsyncStorage.getItem("userid");
      let Token = await AsyncStorage.getItem("token");
      // console.log(customer_id);
      // var mobileNumber = this.state.mobile.replace('+39','');
    //   console.log(ret);   
      const requestData = {
        access_token: Token,
        current_user_id: customer_id,
        categories_id: this.state.category_id,
        sub_category_id: this.state.sub_category_id,
        title_of_product: this.state.title,
        mobile_number: this.state.mobile,
        product_description: this.state.description,
        product_image: this.state.productImages,
        phone_code: this.state.phone_code,
      };
    //   console.log(requestData);
      saveAdvertProductData(requestData).then(
        function (responseJson) {
            // console.log(responseJson)
          if (responseJson.status == 1) {
            this.setState(
              {
                loader: false,
              },
            );
            // this.dropdown.alertWithType('success', t('Success'), (responseJson.error));
            this.props.navigation.navigate('SuccesspageMarketPlaceCreateAds');
          } else {
            this.setState({ loader: false });
            // this.dropdown.alertWithType('error', t('Error'), (responseJson.error));
            this.props.navigation.navigate('errorpage', {route_name: 'create_ads'});
          }
        }.bind(this)
      );
    }

  async attachphoto() {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    let { productImagesForDisplay, productImages } = this.state;
    if (result) {
      this.setState({ loader: true })
      const manipResult = await ImageManipulator.manipulateAsync(result.uri,
        [{ resize: { height: 1024 } }],
        { compress: 0, format: ImageManipulator.SaveFormat.PNG, base64: true }
      );
      // console.log(manipResult);
      // productImages.push(result.base64);
      // productImagesForDisplay.push(result.uri);
      productImages.push(manipResult.base64);
      productImagesForDisplay.push(manipResult.uri);
      // console.log(manipResult.base64);
    }

    if (productImagesForDisplay.length > 0) {
      this.setState({ loader: false })
    }
  }

  onRefresh() {
    this.setState({ loader: true });
  }

  closeModal = (visible) => {
    this.setState({ modalVisible: visible });
  };

  render() {
    const { navigate } = this.props.navigation;
    const {
      loader,
      productImages,
      title,
      description,
      mobile,
      phone_code,
      productImagesForDisplay,
      // termAndCondition,
      modalVisible
    } = this.state;
    if (!loader) {
      return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>

          {/* <Row style={{ marginTop: -20, height: 120 }}>
            <Image
              source={require("../../images/Header-Curv-Shape.png")}
              style={{ width: "100%", height: 100 }}
            />
            <Row style={styles.slide2Logo}>
              <TouchableOpacity
                style={{ alignItems: "center", padding: 20, width: 60 }}
                onPress={() => navigate("MarketPlaceCreateSubCategory")}
              >
                <Col style={{ justifyContent: "center" }}>
                  <Back_Arrow width={15} height={15} />
                </Col>
              </TouchableOpacity>
              <Col style={styles.header}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontFamily: "Roboto-Bold",
                  }}
                >
                  {t("Back")}
                </Text>
              </Col>
            </Row>
          </Row> */}


          <Row style={styles.headerContainer}>
            <View style={styles.top_background}>
              <View style={styles.top_content}>
                <TouchableOpacity style={styles.headerBackArrow} onPress={() => navigate("MarketPlaceCreateSubCategory")}>
                  <Col style={{ justifyContent: 'center' }}>
                    <Back_Arrow width={15} height={15} />
                  </Col>
                </TouchableOpacity>
                <Text style={styles.headerText}> {t("Back")}</Text>
              </View>
            </View>
          </Row>

          <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "height" : null}>
            <ScrollView>
              <Row style={{ height: 50 }}>
                {/* <Col style={[styles.InputCol,{marginTop:20}]}>
              <TextInputMaterial
                label={
                  <Text
                    style={{
                      fontFamily: "Roboto-Medium",
                      //   fontSize: 30,
                      //   fontWeight: "bold",
                      //   textAlign: "center",
                      //   color:'#67c46a'
                    }}
                  >
                    {t("Title")}
                  </Text>
                }
                // style={{fontSize:30, fontWeight:'bold', fontFamily: "Roboto-Medium", textAlign: "center",}}
                value={title}
                labelActiveColor={"#666666"}
                underlineColor={"#67c46a"}
                underlineActiveColor={"#67c46a"}
                onChangeText={(title) => this.setState({ title: title })}
              />
            </Col> */}

                <Col style={styles.InputCol}>

                  <TextInput
                    style={{ fontFamily: "Roboto-Bold", width: "100%", textAlign: 'center' }}
                    placeholder={t('Title')}
                    placeholderTextColor={'#62bb46'}
                    fontSize={24}
                    color={'#62bb46'}
                    value={title}
                    onChangeText={(title) => this.setState({ title: title })}
                  />

                </Col>
              </Row>
              <LinearGradient
                colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
                start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
                style={{ marginHorizontal: 20 }}
              >
                <Row style={{ height: 2, }}>
                </Row>
              </LinearGradient>
              {productImagesForDisplay == null || productImagesForDisplay == "" ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    height: 170,
                  }}
                >
                  <Row>
                    <Image
                      source={require("../../images/Default-Image.png")}
                      style={{ width: "75%", height: 170 }}
                    />
                  </Row>
                  <Row>
                    <TouchableOpacity
                      style={{
                        height: 70,
                        position: "relative",
                        top: "12%",
                        left: 130,
                      }}
                      onPress={() => this.attachphoto()}
                    >
                      <Image
                        source={require("../../images/Camera-icon.png")}
                        style={{ width: 50, height: 50 }}
                      />
                    </TouchableOpacity>
                  </Row>
                </View>
              ) : (
                // <View>
                <Row style={{
                  justifyContent: "center",
                  alignItems: "center",
                  // marginTop: 20,
                  height: 200
                }}>
                  <SliderBox
                    // ImageComponent={FastImage}
                    images={productImagesForDisplay}
                    sliderBoxHeight={170}
                    disableOnPress
                    //   onCurrentImagePressed={(index) =>
                    //     console.warn(`image ${index} pressed`)
                    //   }
                    dotColor="#62bb45"
                    inactiveDotColor="#b2dea1"
                    paginationBoxVerticalPadding={20}
                    // autoplay
                    circleLoop
                    resizeMethod={"resize"}
                    resizeMode={"cover"}
                    paginationBoxStyle={{
                      position: "absolute",
                      bottom: -30,
                      padding: 0,
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      paddingVertical: 10,
                    }}
                    dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: "rgba(128, 128, 128, 0.92)",
                    }}
                    ImageComponentStyle={{
                      borderRadius: 10,
                      width: "75%",
                      marginTop: 20,
                    }}
                    imageLoadingColor="#2196F3"
                  />

                  <TouchableOpacity
                    style={{
                      height: 70,
                      position: "absolute",
                      top: "70%",
                      right: 25,
                    }}
                    onPress={() => this.attachphoto()}
                  >
                    <Image
                      source={require("../../images/cameraPlus.png")}
                      style={{ width: 70, height: 70, }}
                    />
                  </TouchableOpacity>
                </Row>


                // </View>
              )}

              <Row style={{ marginHorizontal: 20, height: 150, marginTop: 40 }}>
                <TextInput
                  placeholder={t('Describe the product')}
                  style={{
                    width: "100%",
                    // marginTop: 40,
                    textAlign: "justify",
                    textAlignVertical: "top",
                    paddingLeft: 15,
                    paddingTop: 15,
                    color: "#62bb45",
                    backgroundColor: '#f8f8f8',
                    fontSize: 16,
                  }}
                  placeholderTextColor='#62bb45'
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={(description) =>
                    this.setState({ description: description })
                  }
                ></TextInput>
              </Row>

              <Row>
            <Text style={{ fontFamily: "Roboto-Medium", color:'#828282', marginTop:20, marginLeft:20 }}>
                    {t("Telephone Number")}
            </Text>
          </Row>    
          <Row style={{height:40,  justifyContent:'center', alignItems:'center'}}>
            <Col style={{width:'8%', borderBottomColor:'#67c46a', marginLeft:'10%'}} ><Text>{phone_code}</Text></Col>
            <Col style={[styles.InputCol], {width:"92%"}}>
              <TextInput
                label={
                  <Text style={{ fontFamily: "Roboto-Medium" }}>
                    {t("Telephone Number")}
                  </Text>
                }
                value={mobile}
                labelActiveColor={"#666666"}
                keyboardType="numeric"
                // keyboardType="phone-pad"
                maxLength={15}
                // style={{borderBottomColor:'#fff'}}
                underlineColor={"#fff"}
                underlineActiveColor={"#fff"}
                onChangeText={(mobile) => this.setState({ mobile: mobile })}
                
              />
            </Col>
          </Row>
          <LinearGradient
              colors={['rgba(140,198,63,0.8)', 'rgba(57, 181, 74,0.8)']}
              start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }}
              style={{ marginHorizontal: 20 }}
          >
              <Row style={{ height: 2, }}>
              </Row>
          </LinearGradient>

              <Row
                style={{
                  marginBottom: "30%",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",

                }}
              >
                <TouchableOpacity onPress={() => this.saveData()}>
                  <Text
                    style={{
                      ...Platform.select({
                        ios: {
                          borderWidth: 1,
                          borderColor: "#7cd36d",
                          paddingVertical: 20,
                          paddingHorizontal: 40,
                          borderRadius: 40,
                          width: "100%",
                          textAlign: "center",
                          color: "#666666",
                          fontSize: 28,
                          fontFamily: "Roboto-Medium",
                        },
                        android: {
                          borderWidth: 1,
                          borderColor: "#7cd36d",
                          paddingVertical: 20,
                          paddingHorizontal: 40,
                          borderRadius: 60,
                          width: "100%",
                          textAlign: "center",
                          color: "#666666",
                          fontSize: 28,
                          fontFamily: "Roboto-Medium",
                        }
                      })
                    }}
                  >
                    {t("CONFIRMATION")}
                  </Text>
                </TouchableOpacity>
              </Row>
            </ScrollView>
          </KeyboardAvoidingView>
          <DropdownAlert ref={ref => this.dropdown = ref} />
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

// empty component
const EmptyComponent = ({ title }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{title}</Text>
  </View>
);

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
        height: 90,
        // height: '17%',
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20%",
    // marginTop: height - (height * 40) / 100,
  },
  emptyText: {
    // flex: 1,
    justifyContent: "center",
    fontSize: 23,
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    textAlignVertical: "center",
  },
  slide2Logo: {
    ...Platform.select({
      ios: {
        position: "absolute",
        marginTop: 30,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 50,
      },
      android: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        height: 50,
        width: "100%",
        marginLeft: 50,
      },
    }),
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
  Image: {
    alignItems: "center",
    justifyContent: "center",
    // height: 90,
    width: "100%",
    // borderRadius: 100,
    // marginLeft: 10,
    height: "100%",
  },
  newsItemContainer: {
    width: "100%",
    // margin:15,
    // marginRight:50,
    height: 150,
    backgroundColor: "white",
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6.22,
    elevation: 5,
  },
  header: {
    ...Platform.select({
      ios: {
        marginLeft: 38,
      },
      android: {
        // marginLeft: 20
        marginLeft: (width / 100) * 10,
      },
    }),
  },
  InputCol: {
    marginHorizontal: 30,
    // marginLeft: 30,
  },

  InputColTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20
  },
  centeredView: {
    shadowColor: "#232324",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1.22,
    elevation: 500,
    // width: Dimensions.get('window').width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(100,100,100, 0.8)",
  },
  modalView: {
    justifyContent: "center",
    marginVertical: "20%",
    borderRadius: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    shadowColor: "#232324",
    shadowOffset: {
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
