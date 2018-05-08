#!/bin/bash
mv -f /data/www/linux/iptables /etc/sysconfig
yum install nginx -y
mv -f /data/www/linux/default.conf /etc/nginx/conf.d
nginx -t
nginx
curl 127.0.0.1
