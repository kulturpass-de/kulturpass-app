package de.bkm.kulturpass;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.nfc.NfcAdapter;
import android.nfc.tech.IsoDep;
import android.nfc.tech.NfcA;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "cultureapp";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  /**
   * The following was added as a fix for java.lang.IllegalStateException: Screen fragments should never be restored.
   * https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    androidx.core.splashscreen.SplashScreen.installSplashScreen(this);
    super.onCreate(null);
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    private NfcAdapter nfcAdapter;
    private PendingIntent pendingIntent;

    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(null);
      nfcAdapter = NfcAdapter.getDefaultAdapter(this.getContext());
      if (nfcAdapter == null) {
        return;
      }
      Intent intent = new Intent(this.getContext(), this.getPlainActivity().getClass());
      intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        pendingIntent = PendingIntent.getActivity(this.getContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
      } else {
        pendingIntent = PendingIntent.getActivity(this.getContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
      }
    }

    @Override
    protected void onResume() {
      super.onResume();
      if (nfcAdapter != null) {
        nfcAdapter.enableForegroundDispatch(
                this.getPlainActivity(),
                pendingIntent,
                new IntentFilter[]{new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED)},
                new String[][]{new String[]{IsoDep.class.getName(), NfcA.class.getName()}}
        );
      }
    }
    @Override
    protected void onPause() {
      super.onPause();
      if (nfcAdapter != null) {
        nfcAdapter.disableForegroundDispatch(this.getPlainActivity());
      }
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
