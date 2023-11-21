source 'https://rubygems.org'

ruby '~> 3.0'
gem 'cocoapods','~> 1.14'
gem 'activesupport', '>= 6.1.7.3', '< 7.1.0'
gem 'fastlane', '> 0'
gem 'slather', '> 0'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
