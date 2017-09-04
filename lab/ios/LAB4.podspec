#
#  Be sure to run `pod spec lint LAB4.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see http://docs.cocoapods.org/specification.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |s|

  # ―――  Spec Metadata  ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  These will help people to find your library, and whilst it
  #  can feel like a chore to fill in it's definitely to your advantage. The
  #  summary should be tweet-length, and the description more in depth.
  #

  s.name         = "LAB4"
  s.version      = "1.0.0"
  s.summary      = "light app builder 4."

  # This description is used to generate tags and improve search results.
  #   * Think: What does it do? Why did you write it? What is the focus?
  #   * Try to keep it short, snappy and to the point.
  #   * Write the description between the DESC delimiters below.
  #   * Finally, don't worry about the indent, CocoaPods strips it!
  s.description  = "light app builder 4."

  s.homepage     = "http://lab4.lightappbuilder.com"
  # s.screenshots  = "www.example.com/screenshots_1.gif", "www.example.com/screenshots_2.gif"


  # ―――  Spec License  ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  Licensing your code is important. See http://choosealicense.com for more info.
  #  CocoaPods will detect a license file if there is a named LICENSE*
  #  Popular ones are 'MIT', 'BSD' and 'Apache License, Version 2.0'.
  #

  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }


  # ――― Author Metadata  ――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  Specify the authors of the library, with email addresses. Email addresses
  #  of the authors are extracted from the SCM log. E.g. $ git log. CocoaPods also
  #  accepts just a name if you'd rather not provide an email address.
  #
  #  Specify a social_media_url where others can refer to, for example a twitter
  #  profile URL.
  #

  s.author             = { "yinhf" => "" }
  # Or just: s.author    = "yinhf"
  # s.authors            = { "yinhf" => "" }
  # s.social_media_url   = "http://twitter.com/yinhf"

  # ――― Platform Specifics ――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  If this Pod runs only on iOS or OS X, then specify the platform and
  #  the deployment target. You can optionally include the target after the platform.
  #

  # s.platform     = :ios
  s.platform     = :ios, "8.0"

  #  When using multiple platforms
  # s.ios.deployment_target = "5.0"
  # s.osx.deployment_target = "10.7"
  # s.watchos.deployment_target = "2.0"
  # s.tvos.deployment_target = "9.0"


  # ――― Source Location ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  Specify the location from where the source should be retrieved.
  #  Supports git, hg, bzr, svn and HTTP.
  #

  s.source       = { :git => "http://lab4.lightappbuilder.com/LAB4.git", :tag => "#{s.version}" }


  # ――― Source Code ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  CocoaPods is smart about how it includes source code. For source files
  #  giving a folder will include any swift, h, m, mm, c & cpp files.
  #  For header files it will include any header in the folder.
  #  Not including the public_header_files will make all headers public.
  #

  # s.source_files  = "Classes", "Classes/**/*.{h,m}"
  # s.exclude_files = "Classes/Exclude"

  # s.public_header_files = "Classes/**/*.h"


  # ――― Resources ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  A list of resources included with the Pod. These are copied into the
  #  target bundle with a build phase script. Anything else will be cleaned.
  #  You can preserve files from being cleaned, please don't preserve
  #  non-essential files like tests, examples and documentation.
  #

  # s.resource  = "icon.png"
  # s.resources = "Resources/*.png"

  # s.preserve_paths = "FilesToSave", "MoreFilesToSave"


  # ――― Project Linking ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  Link your library with frameworks, or libraries. Libraries do not include
  #  the lib prefix of their name.
  #

  # s.framework  = "SomeFramework"
  # s.frameworks = "SomeFramework", "AnotherFramework"

  # s.library   = "iconv"
  # s.libraries = "iconv", "xml2"


  # ――― Project Settings ――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  If your library depends on compiler flags you can set them in the xcconfig hash
  #  where they will only apply to your library. If you depend on other Podspecs
  #  you can include multiple dependencies to ensure it works.

  # s.requires_arc = true

  # s.xcconfig = { "HEADER_SEARCH_PATHS" => "$(SDKROOT)/usr/include/libxml2" }
  # s.dependency "JSONKit", "~> 1.4"


  # ――― subspec ――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  s.subspec 'LABLibrary' do |library|
    library.source_files = 'LABLibrary', 'LABLibrary/**/*.{h,m}'#, 'LABLibrary/Views/**/*.{h,m}', 'LABLibrary/Modules/**/*.{h,m}'
    # ss.public_header_files = 'LABLibrary/LABLibrary.h'
    library.dependency 'React/Core'
    library.dependency 'React/RCTActionSheet'
    library.dependency 'React/RCTGeolocation'
    library.dependency 'React/RCTImage'
    library.dependency 'React/RCTLinkingIOS'
    library.dependency 'React/RCTNetwork'
    library.dependency 'React/RCTSettings'
    library.dependency 'React/RCTText'
    library.dependency 'React/RCTVibration'
    library.dependency 'React/RCTWebSocket'
    library.dependency 'React/RCTPushNotification'
    library.dependency 'React/ART'
    library.dependency 'React/RCTAnimation'
    library.dependency 'JZLocationConverter'
    library.dependency 'Bugly'
    library.dependency 'Masonry'
    library.dependency 'AFNetworking'
    library.dependency 'MJRefresh'
    library.dependency 'SDWebImage'
    library.dependency 'MJExtension'
    library.dependency 'MWPhotoBrowser', '~> 2.1.2'
    library.framework = 'CoreLocation', 'SystemConfiguration'
  end

  s.subspec 'LABMap' do |map|
    map.source_files = 'LABMap/Classes/*.{h,m}'
    map.resource_bundles = {'LABMap'=>"LABMap/Resources/*.png"}
    map.dependency 'BaiduMapKit'
  end

  s.subspec 'Push' do |jpush|
    jpush.source_files = 'Push/*.{h,m}'
    jpush.dependency 'JPush', '2.2.0.1'
  end

  s.subspec 'Welcome' do |welcome|
    welcome.source_files = 'Welcome/*.{h,m}'
  end

  s.subspec 'Pay' do |pay|
    pay.source_files = 'Pay/*.{h,m}'
    pay.dependency 'Pingpp/Core'
    pay.dependency 'Pingpp/Wx'
    pay.dependency 'Pingpp/Alipay'
  end

  s.subspec 'Video' do |video|
    video.source_files = 'Video/*.{h,m}'
    video.dependency 'ZFPlayer', '2.0.0'
  end

  s.subspec 'LABLogger' do |logger|
    logger.source_files = 'LABLogger/*.{h,m}'
  end

  s.subspec 'AudioKit' do |audio|
    audio.source_files = "AudioKit/*.{h,m}"
    audio.dependency 'EZAudio', '~> 1.1.5'
  end

  s.subspec 'UMengUShare' do |um|
    um.subspec 'core' do |core|
      core.source_files = "UMengUShare/*.{h,m}"
      core.dependency 'UMengUShare/Network', '6.1.2'
      core.dependency 'UMengUShare/Core', '6.1.2'
      core.dependency 'UMengUShare/UI', '6.1.2'
      core.dependency 'MJExtension'
    end

    um.subspec 'qq' do |qq|
      qq.dependency 'UMengUShare/Social/QQ', '6.1.2'
    end

    um.subspec 'wx' do |wx|
      wx.dependency 'UMengUShare/Social/WeChat', '6.1.2'
    end

    um.subspec 'wb' do |wb|
      wb.dependency 'UMengUShare/Social/Sina', '6.1.2'
    end

  end

end
