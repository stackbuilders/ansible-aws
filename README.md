# Configure AWS with Ansible

Deploy a basic AWS infrastructure with Ansible

### Setup AWS-CLI access and install dependencies for `aws-cli` 

[Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-linux.html)

### Configure AWS credentials:

```
$ aws configure
```

You can have multiple credentials on several profiles, to add a credentials to a specific profile, use

```
$ aws configure --profile myprofile
$ export AWS_PROFILE=myprofile 
```

### Install dependencies for the project

```
$ cd ansible
$ ansible-galaxy install -fr requirements.yml
```

## Prepare the Minichat

Run the AWS playbook

```
$ cd ansible
$ AWS_PROFILE=myprofile ansible-playbook playbooks/aws-provision.yml
```
Run the playbook to deploy the app

```
$ ansible-playbook playbooks/deploy-app.yml
```

Verify if the variables in `ansible-playbook playbooks/deploy-app.yml` 
are adapted to your environment.
