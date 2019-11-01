//
//  RNCloseApp.m
//  NextyWallet
//
//  Created by Tho Nguyen on 12/10/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RNCloseApp.h"
#import <React/RCTLog.h>

@implementation RNCloseApp

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(exitApp:(BOOL)isError )
{
  RCTLogTrace(@"RNCloseApp is closing application bacause you asked to.");
  exit(isError);
 // [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"LuckyDrawer:"]];
}
@end
