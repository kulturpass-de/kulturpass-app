import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    FirebaseApp.configure()
    self.moduleName = "cultureapp"
    self.dependencyProvider = RCTAppDependencyProvider()

    #if JS_LOGGING
    // Enable console.log logging in macOS Console App for Release builds
    RCTSetLogThreshold(.trace)
    RCTSetLogFunction { level, source, fileName, lineNumber, message in
      NSLog("%@", RCTFormatLog(nil, level, nil, nil, message))
    }
    #endif

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

   override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
 
  override func bundleURL() -> URL? {
  #if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }

  // Adds Deeplinking support
  override func application(_ application: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return RCTLinkingManager.application(application, open: url, options: options)
  }

  override func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
  }
}