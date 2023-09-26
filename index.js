import inquirer from "inquirer"
import chalk from "chalk"

import fs from "fs"

operacao()
function operacao(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar conta', 'Entrar', 'Sair']
        }
    ]).then((resposta) =>{
        const action = resposta['action']

        if(action === 'Criar conta'){
            criando_conta()
        }else if(action === 'Entrar'){
            login()
        }else if(action === 'Sair'){
            console.log(chalk.bgCyan(' Obrigado por usar a conta '))
            process.exit()
        }
    })
    .catch(err =>{
        console.log(err)
    })
}

//criando a conta
function criando_conta(){
    console.log(chalk.bgCyan.black(' Parabéns por escolher nosso banco '))
    construindo_conta()
}

// construindo a conta
function construindo_conta(){
  
    inquirer.prompt([
        {
            name: 'nome_conta', 
            message: 'Digite um nome para sua conta: '
        },
        {
            name: 'senha_conta',
            message: 'Digite uma senha para sua conta: ',
        }
    ]).then((resposta) =>{
        const nome_conta = resposta['nome_conta']
        const senha_conta = resposta['senha_conta']

        console.info(nome_conta)
        console.info(senha_conta)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${nome_conta}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome!'))
            return construindo_conta()
        }

        const accountData = {
            balance: 0,
            senha: senha_conta 
        }

        fs.writeFileSync(`accounts/${nome_conta}.json`,JSON.stringify(accountData, null, 2), function (err){
            console.log(err)
        })

        console.log(chalk.green('Sua conta foi criada com sucesso!!!'))
        operacao()

    }).catch(err =>{
        console.log(err)
    })
}

// efetuando login
function login(){
    inquirer.prompt([
        {
            name: 'nome_conta',
            message: 'Digite o nome da sua conta: '

        },
        {
            name: 'senha_conta',
            message: 'Digite sua senha',
        }
    ]).then(resposta => {
        const nome_conta = resposta['nome_conta']
        const senha_conta = resposta['senha_conta']

        if(checkAccount(nome_conta, senha_conta)){
            return login()
        }

        console.log('Sucesso')
        
    }).catch(err =>{
        console.log(err)
    })
}

// checando se conta existe
function checkAccount(nome_conta, senha_conta){

    let ler_senha
    let senha

    if(fs.existsSync(`accounts/${nome_conta}.json`)){
        ler_senha = fs.readFileSync(`accounts/${nome_conta}.json`, 'utf8')
        // Analisa o conteúdo do arquivo JSON
        const objetoJSON = JSON.parse(ler_senha);
      
        // Acesse o valor da chave "idade"
        senha = objetoJSON.senha;
    }

    if(!fs.existsSync(`accounts/${nome_conta}.json`) && senha_conta != senha){
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return true
    }

    return false
}