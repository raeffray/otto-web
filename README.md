otto-web
========

## Setting up your development environment ##

Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads).

Install [Vagrant](http://downloads.vagrantup.com/).

Make sure everything is working.

```
$ VBoxManage --version
4.3.0r89960
$ vagrant --version
Vagrant 1.3.5
```

Clone this project.

```
$ git clone --recursive https://github.com/raeffray/otto-web.git
```
or
```
$ git clone --recursive git@github.com:raeffray/otto-web.git
```

Let Vagrant and Chef do their magic.

```
$ cd otto-web
$ vagrant up
```

SSH to the VM and start the application.

```
$ vagrant ssh
vagrant@vagrant:~$ cd /vagrant
vagrant@vagrant:~$ npm install
vagrant@vagrant:~$ node app.js
```

Open the application URL (http://192.168.222.222:3000/).

![CodeShipStatus] (https://www.codeship.io/projects/2d36f190-2942-0131-ec5e-1e0602f52547/status)


> Written with [StackEdit](https://stackedit.io/).
