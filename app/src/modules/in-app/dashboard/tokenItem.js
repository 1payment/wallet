import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Color from "../../../../helpers/constant/color";
import ImageApp from "../../../../helpers/constant/image";
import URI from "../../../../helpers/constant/uri";
import TextTicker from '../../../../lib/react-native-text-ticker'
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as font_size } from '../../../../helpers/constant/responsive';

class TokenItem extends Component {
  static propTypes = {
    name: PropTypes.string,
    network: PropTypes.string,
    balance: PropTypes.number,
    price: PropTypes.number,
    percent_change: PropTypes.number
  };

  static defaultProps = {
    price: 0,
    percent_change: 0
  };

  render() {
    const {
      name,
      network,
      price,
      percent_change,
      total_balance,
      id,
      address,
      account,
      id_market
    } = this.props.InforToken;
    let ic_token;
    switch (network) {
      case "ethereum":
        if (address == "") {
          ic_token = ImageApp.ic_eth_token;
          break;
        } else {
          ic_token = "ERC20";
          break;
        }
      case "nexty":
        if (address == "") {
          ic_token = ImageApp.ic_nty_token;
          break;
        } else {
          ic_token = "NRC20";
          break;
        }
      case "tron":
        Ic_network = ImageApp.ic_trx_home;
        break;
      case "addToken":
        if (address == "") {
          ic_token = ImageApp.ic_trx_token;
          break;
        } else {
          ic_token = "TRC20";
          break;
        }
      default:
        ic_token = null;
        break;
    }
    if (network == "addToken") {
      return (
        <TouchableOpacity
          style={[styles.styleButtonAddnew]}
          onPress={() => this.props.navigation.navigate("ListToken", {
            payload: {
              changeMount: this.props.changeMount
            }
          })}
        >
          <Image source={ImageApp.ic_add_new_wallet} />
          <Text style={{
            fontSize: font_size(2),
            fontWeight: "bold",
            textAlign: "center",
            color: Color.Tomato
          }}>Create a new coin/token</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("Token", {
              payload: {
                name,
                network,
                id,
                address,
                changeMount: this.props.changeMount
              }
            })
          }
          style={styles.styleButton}
        >
          <View style={styles.container}>
            <View style={{ flex: 2, justifyContent: 'center', }}>
              {/* <Image source={{ uri:}} /> */}
              {id_market == 0 ? (
                <View style={styles.styleCircleAvatar}>
                  <Text style={{ fontSize: 10 }}>{ic_token}</Text>
                </View>
              ) : (
                  <Image
                    source={{ uri: URI.MARKET_CAP_ICON + id_market + ".png" }}
                    style={{ height: 45, width: 45 }}
                    resizeMode="contain"
                  />
                )}
            </View>
            <View style={{ flex: 4, justifyContent: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 17,
                  color: Color.Dark_gray,
                  marginBottom: 4
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Color.Dark_gray
                }}
              >
                {price}${" "}
                <Text
                  style={{
                    fontSize: 14,
                    color: percent_change > 0 ? Color.Malachite : Color.Scarlet
                  }}
                >
                  {percent_change > 0
                    ? `+${percent_change}%`
                    : `${percent_change}%`}
                </Text>
              </Text>
            </View>
            <View style={{ flex: 4, justifyContent: "center" }}>
              {
                total_balance.toString().length > 8 ?
                  <TextTicker
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 25,
                      color: Color.Dark_gray,
                      marginBottom: 1
                    }}
                    duration={3000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={30}
                  >
                    {total_balance}
                  </TextTicker>
                  :
                  <Text
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 25,
                      color: Color.Dark_gray,
                      marginBottom: 1
                    }}
                  >
                    {total_balance}
                  </Text>
              }

              <Text
                style={{
                  textAlign: "right",
                  fontSize: 14,
                  color: Color.Dark_gray
                }}
              >
                {(price * total_balance) > 1 ? (price * total_balance).toFixed(2) : (price * total_balance) == 0 ? 0 : (price * total_balance).toFixed(5)}${" "}
              </Text>
            </View>
            {/* <View style={{ flex: 8, paddingHorizontal: 10 }}>
                            <Text style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: 17,
                                color: Color.Dark_gray
                            }}>{name}</Text>
                            <Text style={{
                                textAlign: 'right',
                                fontWeight: 'bold',
                                fontSize: 25,
                                color: Color.Dark_gray
                            }}>{total_balance}</Text>
                        </View> */}
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  styleButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.14,
    shadowRadius: 1,
    elevation: 2,
    marginBottom: 10
  },
  styleCircleAvatar: {
    height: 45,
    width: 45,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Color.SILVER,
    justifyContent: "center",
    alignItems: "center"
  },
  styleButtonAddnew: {
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TokenItem);
