package com.nextywallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import io.realm.react.RealmReactPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.entria.views.RNViewOverflowPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new RNDeviceBrightness(),
            new WebViewBridgePackage(),
            new RNFSPackage(),
            new RealmReactPackage(),
              new FingerprintAuthPackage(),
              new RNFirebasePackage(),
              new LinearGradientPackage(),
              new RNViewOverflowPackage(),
              new RNI18nPackage(),
              new SplashScreenReactPackage(),
              new SvgPackage(),
              new VectorIconsPackage(),
              new UdpSocketsModule(),
              new TcpSocketsModule(),
              new RandomBytesPackage(),
              new RNOSModule(),
              new ReactNativeDocumentPicker(),
              new RNCameraPackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
