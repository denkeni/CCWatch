#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "RNNAppDelegate.h"

@interface AppDelegate : RNNAppDelegate <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
