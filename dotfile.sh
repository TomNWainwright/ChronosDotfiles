#!/bin/bash


rm .bash_aliases .profile .bash_logout .bashrc .profile .xiwirc .xscreensaver
rm -R .config
cd ~/Dotfiles

ln -s ~/Dotfiles/profile ~/.profile 
ln -s ~/Dotfiles/bash_aliases ~/.bash_aliases
ln -s ~/Dotfiles/bash_logout ~/.bash_logout
ln -s ~/Dotfiles/bashrc ~/.bashrc
ln -s ~/Dotfiles/xiwirc ~/.xiwirc
ln -s ~/Dotfiles/xscreensaver ~/.xscreensaver
ln -s ~/Dotfiles/config ~/.config

