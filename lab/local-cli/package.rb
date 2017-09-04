require 'optparse'

options = {}
option_parser = OptionParser.new do |opts|
  # react-native-ios-cli script
  opts.banner = '构建脚本'

  # 下面第一项是 Short option（没有可以直接在引号间留空），第二项是 Long option，第三项是对 Option 的描述
  opts.on('-m ', '--module ', '要打包的target名') do |value|
    options[:target_name] = value
  end

  opts.on('-b ', '--build-type ', '构建方式') do |value|
    options[:build_type] = value
  end

  opts.on('-o ', '--output-dir ', '导出包的路径') do |value|
    options[:output_dir] = value
  end

  opts.on('-c ', '--build-code ', 'build-code') do |value|
    options[:build_code] = value
  end

  opts.on('-v ', '--build-version ', 'version of app') do |value|
    options[:build_version] = value
  end

  # Option 作为 flag，带一组用逗号分割的arguments，用于将arguments作为数组解析
  # opts.on('-a A,B', '--array A,B', Array, 'List of arguments') do |value|
  #   options[:array] = value
  # end

end.parse!

# puts options.inspect
workspaceName = ""

Dir["*.xcworkspace"].each {|x|
  workspaceName = x
}

# puts workspaceName


system 'fastlane ios archive module:' + options[:target_name] + ' type:' + options[:build_type] + ' odir:' + options[:output_dir] + ' code:' + options[:build_code] + ' version:' + options[:build_version] + ' workspace:' + workspaceName
