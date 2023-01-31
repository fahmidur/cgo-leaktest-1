#!/usr/bin/env ruby

require 'open3'
require 'fileutils'

def run(cmd)
  puts "RUN: #{cmd}"
  waitval = nil
  Open3.popen3(cmd) do |stdin, stdout, stderr, wait_thr|
    {stdout: stdout, stderr: stderr}.each do |name, io|
      Thread.new do 
        io.each_line do |line|
          puts "#{name}: #{line}"
        end
      end
    end
    wait_thr.join
    waitval = wait_thr.value
  end
  return waitval.exitstatus
end

def nochange?(path, out)
  if File.exist?(out) && File.stat(path).mtime <= File.stat(out).mtime
    return true
  end
  return false
end

def build_go(path)
  #puts "build_go. path=#{path}"
  ext = File.extname(path)
  basename = File.basename(path, ext)
  out = "./build/#{basename}"
  #puts "out=#{out}"
  return false if nochange?(path, out)
  puts "build_go. building. path=#{path} out=#{out}"
  FileUtils.mkdir_p(File.dirname(out))
  FileUtils.rm_f(out)
  ecode = run("go build -o #{out} #{path}")
  puts "build_go. ecode=#{ecode}. #{ecode == 0 ? 'SUCCESS' : 'FAILURE'}"
  puts "---"
  return true
end

def build_c(path)
  #puts "build_c. path=#{path}"
  ext = File.extname(path)
  basename = File.basename(path, ext)
  out = "./build/#{basename}"
  #puts "out=#{out}"
  return false if nochange?(path, out)
  puts "build_c. building. path=#{path} out=#{out}"
  FileUtils.mkdir_p(File.dirname(out))
  FileUtils.rm_f(out)
  ecode = run("gcc -g -o #{out} #{path}")
  puts "build_c. ecode=#{ecode}. #{ecode == 0 ? 'SUCCESS' : 'FAILURE'}"
  puts "---"
  return true
end

build_count = 0 
Dir.open(".").each do |path|
  next if [".", ".."].member?(path)
  next if Dir.exist?(path)
  ext = File.extname(path)
  if ext == ".go" && build_go(path)
    build_count += 1
  end
  if ext == ".c" && build_c(path)
    build_count += 1
  end
end

puts "="*40
puts "build_count=#{build_count}"
if build_count == 0
  puts "--- NO CHANGE ---"
end

