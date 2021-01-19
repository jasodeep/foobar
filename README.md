# foobar


A rudimentary configuration management tool.

# How to install ?

  - Clone the repo.
  - run `cd foobar; chmod 755 bootsatp.sh; ./bootsrap.sh`
  - done !

# How to write use it ?
- Scaffolding -
[![N|Solid](https://i.ibb.co/xJGTTyQ/Screenshot-2021-01-20-at-5-03-17-AM.png)](https://nodesource.com/products/nsolid)

- Create a `main.json` and define the tasks
 
```[
    {
        "name": "Install Aapche2 HTTP Server",
        "nodes": [
            "my_servers"
        ],
        "jobs": [
            "install_apache"
        ]
    }
]
```
  - Create a `node.json` and define the target servers
  ```sh
[{
    "name": "my_servers",
    "nodes": [{ 
      "ip": "98.234.147.56", 
        "username": "root", 
        "password": "xxxvvv"
      },
      { "ip": "24.85.202.93", 
        "username": "root", 
        "password": "vvvxxx"
    }]
  },
  {
    "name": "database servers",
    "nodes": []
  },
  {
    "name": "app servers",
    "nodes": []
  }]
```
- Now define the jobs in jobs/{JOB_NAME}.json
 ```sh
{
    "jobs": [{
            "module": "install_package",
            "packages": [
                "php",
                "libapache2-mod-php"
            ]
    }]
}
```
# How to run it ?
  - just run `foobar apply` in the root

# Available Modules

Dillinger uses a number of open source projects to work properly:

* install_package - Installs debian packages
```
{
    "jobs": [{
            "module": "install_package",
            "packages": [
                "php",
                "libapache2-mod-php"
            ]
    }]
}
```
* copy_file - Copy files to target nodes
```
{
    "jobs": [{
            "module": "copy_file",
            "source": "./jobs/deploy_app/files/index.php",
            "destination": "/var/www/html/index.php",
            "permission": "755",
            "owner": "root:www-data",
            "force_copy": false
    }]
}
```
